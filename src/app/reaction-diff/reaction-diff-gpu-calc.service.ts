import {ReactionDiffCalcParams} from './reaction-diff-calc-params';
import {CellWeights, weightsToArray} from './cell-weights';
import {ReactionDiffCalculator} from './reaction-diff-calculator';
import {Observable} from 'rxjs/Observable';
import {Cell} from './cell';
import {GpuJsService, inp} from './gpujs.service';
import {ColorMapperService} from './color-mapper.service';

export class ReactionDiffGpuCalcService implements ReactionDiffCalculator {
  grid: Float32Array;
  numberThreads = 1;
  private weights: number[];
  private addChemicalRadius: number;
  private diffRateA: number;
  private diffRateB: number;
  private feedRate: number;
  private killRate: number;
  private calcNextKernel: KernelFunction;
  private speed: number;
  private addChemicalsKernel: KernelFunction;
  private imageKernel: KernelFunction;
  private image: HTMLCanvasElement;

  constructor(private width: number, private height: number,
              calcParams$: Observable<ReactionDiffCalcParams>,
              calcCellWeights$: Observable<CellWeights>,
              addChemicalRadius$: Observable<number>,
              speed$: Observable<number>,
              private  gpuJs: GpuJsService,
              private colorMapper: ColorMapperService) {
    calcParams$.subscribe((calcParams) => this.setCalcParams(calcParams));
    calcCellWeights$.subscribe((weights) => this.setWeights(weights));
    addChemicalRadius$.subscribe((radius) => this.addChemicalRadius = radius);
    speed$.subscribe((speed) => this.speed = speed);
    this.reset();
  }

  reset(): void {
    this.createCalcNextGpuKernel();
    this.createAddChemicalsKernel();
    this.createImageKernel();
    this.initGrid();
    this.addChemical(this.width / 2, this.height / 2);
  }

  addChemical(x: number, y: number): void {
    const r = this.addChemicalRadius;
    this.grid = this.addChemicalsKernel(
      x, y,
      inp(this.grid, [this.width * this.height * 2]),
      r,
      this.width);
  }

  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    this.reset();
  }

  updateNumberThreads(numberWebWorkers: number): void {
    // nothing to do here.
  }

  calcNext(): void {
    performance.mark('calcNext-start');
    for (let i = 0; i < this.speed; i++) {
      this.grid = this.calcNextKernel(
        inp(this.grid, [this.width * this.height * 2]),
        this.weights,
        this.diffRateA,
        this.diffRateB,
        this.feedRate,
        this.killRate,
        this.width
      );
    }
    performance.mark('calcNext-end');
    performance.measure('calcNext', 'calcNext-start', 'calcNext-end');
  }

  initGrid() {
    this.grid = new Float32Array(this.width * this.height * 2);
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        this.setCell(x, y, {a: 1, b: 0});
      }
    }
  }


  private setCell(column: number, row: number, cell: Cell, width: number = this.width, arrayToSet: Float32Array = this.grid) {
    const index = (column + row * width) * 2;
    arrayToSet[index] = cell.a;
    arrayToSet[index + 1] = cell.b;
  }

  private setWeights(weights: CellWeights) {
    this.weights = weightsToArray(weights);
  }

  private setCalcParams(calcParams: ReactionDiffCalcParams) {
    this.diffRateA = calcParams.diffRateA;
    this.diffRateB = calcParams.diffRateB;
    this.feedRate = calcParams.feedRate;
    this.killRate = calcParams.killRate;
  }

  drawImage(p: any) {
    this.imageKernel.setOutput([this.width, this.height]);
    this.imageKernel(inp(this.grid, [this.width * this.height * 2]), this.width, this.height);
    const canvas = this.imageKernel.getCanvas();
    let context = (p.canvas as HTMLCanvasElement).getContext('2d');
    context.drawImage(canvas, 0, canvas.height - this.height, this.width, this.height, 0, 0, this.width, this.height);
    return null;
  }

  private createCalcNextGpuKernel() {
    const cellIndex = function (x, columnOffset, rowOffset, width) {
      return x + ((columnOffset * 2) + (rowOffset * width * 2));
    };

    const calcWeightedSum = function (grid, weights: number[], x, width) {
      let sum = 0.0;
      sum += grid[cellIndex(x, -1, -1, width)] * weights[0];
      sum += grid[cellIndex(x, 0, -1, width)] * weights[1];
      sum += grid[cellIndex(x, 1, -1, width)] * weights[2];
      sum += grid[cellIndex(x, -1, 0, width)] * weights[3];
      sum += grid[cellIndex(x, 0, 0, width)] * weights[4];
      sum += grid[cellIndex(x, 1, 0, width)] * weights[5];
      sum += grid[cellIndex(x, -1, 1, width)] * weights[6];
      sum += grid[cellIndex(x, 0, 1, width)] * weights[7];
      sum += grid[cellIndex(x, 1, 1, width)] * weights[8];
      return sum;
    };

    const calcNextA = function (a, dA, laplaceA, abb, f) {
      const nextA = a +
        (dA * laplaceA) -
        abb +
        (f * (1 - a));
      return Math.min(1.0, Math.max(0.0, nextA));
    };

    this.calcNextKernel = this.gpuJs.createKernel(
      function (grid, weights: number[], dA, dB, f, k, width) {
        const oddEvenMod = this.thread.x % 2;
        const indexA = this.thread.x - oddEvenMod;
        const indexB = indexA + 1;
        const a = grid[indexA];
        const b = grid[indexB];
        const laplaceA = calcWeightedSum(grid, weights, indexA, width);
        const laplaceB = calcWeightedSum(grid, weights, indexB, width);

        const abb = a * b * b;

        return (oddEvenMod - 1) * -calcNextA(a, dA, laplaceA, abb, f)
          + (oddEvenMod * (b + (dB * laplaceB) + abb - ((k + f) * b)));
      }
    )
      .setOutput([this.width * this.height * 2])
      .setFloatTextures(true)
      .setFunctions([calcWeightedSum, cellIndex, calcNextA]);
  }

  private createAddChemicalsKernel() {

    this.addChemicalsKernel = this.gpuJs.createKernel(
      function (x, y, grid, radius, width) {

        // even cells are for fluid A. Odd cells are fluid B.
        const oddEvenMod = this.mod(this.thread.x, 2.0);
        const col = (this.thread.x / 2) % width;
        const row = this.thread.x / (width * 2);
        const i = Math.abs(x - col);
        const j = Math.abs(y - row);
        const radPos = Math.sqrt((i * i) + (j * j));

        // we only want to change values for fluid B (oddEvenMod = 1) and when radius > radPos.
        let result = oddEvenMod * this.step(radPos, radius);

        // we invert the result to get fluidA or fluid B if radius
        const fluid = ((result * -1.0) + 1) * grid[this.thread.x];

        result = result * (this.thread.x + this.smoothstep(radius, 0.0, radPos * radPos));
        return this.clamp(result + fluid, 0.0, 1.0);
      }
    )
      .setOutput([this.width * this.height * 2])
      .setFloatTextures(true);
  }

  private createImageKernel() {

     this.imageKernel = this.gpuJs.createKernel(
      function (grid, width, height) {
        const flatIndex = (this.thread.x + ((height - this.thread.y) * width)) * 2;
        const oddEvenMod = flatIndex % 2;
        const indexA = flatIndex - oddEvenMod;
        const indexB = indexA + 1;
        const aVal = grid[indexA];
        const bVal = grid[indexB];

        // background color
        const rbg = 0.1;
        const gbg = 0.25;
        const bbg = 0.1;

        // a color
        const ra = aVal;
        const ga = aVal;
        const ba = 0.8;

        // b color
        const rb = 0;
        const gb = 0;
        const bb = bVal * 0.4;

        // resulting color
        let rr = 0;
        let gr = 0;
        let br = 0;

        if (aVal === 0) {
          rr = this.mix(rbg, rb, bVal);
          gr = this.mix(gbg, gb, bVal);
          br = this.mix(bbg, bb, bVal);
        } else if (bVal === 0) {
          rr = this.mix(rbg, ra, 0.5);
          gr = this.mix(gbg, ga, 0.5);
          br = this.mix(bbg, ba, 0.5);
        } else if (aVal < bVal) {
          const rel = aVal / bVal;
          rr = this.mix(rb, ra, rel);
          gr = this.mix(gb, ga, rel);
          br = this.mix(bb, ba, rel);
        } else {
          const rel = bVal / aVal;
          rr = this.mix(ra, rb, rel);
          gr = this.mix(ga, gb, rel);
          br = this.mix(ba, bb, rel);
        }
        this.color(rr, gr, br);
      }
    )
      .setFloatTextures(true)
      .setGraphical(true);
  }
}
