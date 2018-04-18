import {ReactionDiffCalcParams} from './reaction-diff-calc-params';
import {CellWeights, weightsToArray} from './cell-weights';
import {ReactionDiffCalculator} from './reaction-diff-calculator';
import {Observable} from 'rxjs/Observable';
import {Cell} from './cell';
import {GpuJsService, GpuJsTexture, GraphicalKernelFunction, inp, KernelFunction} from '../core/gpujs.service';

export class ReactionDiffGpuCalcService implements ReactionDiffCalculator {
  grid: ArrayLike<number> | GpuJsTexture;
  numberThreads = 1;
  private lastNextCalc = 0;
  private weights: number[];
  private addChemicalRadius: number;
  private calcNextKernels: KernelFunction<ArrayLike<number> | GpuJsTexture>[] = [];
  private speed: number;
  private imageKernel: GraphicalKernelFunction;
  private calcParams: ReactionDiffCalcParams;
  private nextAddChemicals: (number | number | number | number)[] = [0, 0, 0, 0];

  constructor(private width: number, private height: number,
              calcParams$: Observable<ReactionDiffCalcParams>,
              calcCellWeights$: Observable<CellWeights>,
              addChemicalRadius$: Observable<number>,
              speed$: Observable<number>,
              private  gpuJs: GpuJsService) {
    calcParams$.subscribe((calcParams) => this.setCalcParams(calcParams));
    calcCellWeights$.subscribe((weights) => this.setWeights(weights));
    addChemicalRadius$.subscribe((radius) => this.addChemicalRadius = radius);
    speed$.subscribe((speed) => {
      this.speed = speed;
    });
    this.reset();
  }

  reset(): void {
    this.calcNextKernels = [];
    this.calcNextKernels.push(this.createCalcNextGpuKernel());
    this.calcNextKernels.push(this.createCalcNextGpuKernel());
    this.createCalcNextGpuKernel();
    this.createImageKernel();
    this.initGrid();
    this.addChemical(this.width / 2, this.height / 2);
  }

  addChemical(x: number, y: number): void {
    const r = this.addChemicalRadius;
    this.nextAddChemicals = [x,
      y,
      r, 1.0];
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
    let calcParams = [
      this.calcParams.diffRateA,
      this.calcParams.diffRateB,
      this.calcParams.feedRate,
      this.calcParams.killRate,
      this.width,
      this.height,
      this.calcParams.dynamicKillFeed
    ];

    for (let i = 0; i < this.speed; i++) {
      this.grid = this.calcNextKernels[this.lastNextCalc](
        this.getGridInput(),
        this.weights,
        calcParams,
        this.nextAddChemicals
      );
      this.lastNextCalc = (this.lastNextCalc + 1) % this.calcNextKernels.length;
      this.nextAddChemicals = [0, 0, 0, 0];
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


  private setCell(column: number, row: number, cell: Cell, width: number = this.width) {
    const index = (column + row * width) * 2;
    this.grid[index] = cell.a;
    this.grid[index + 1] = cell.b;
  }

  private setWeights(weights: CellWeights) {
    this.weights = weightsToArray(weights);
  }

  private setCalcParams(calcParams: ReactionDiffCalcParams) {
    this.calcParams = calcParams;
  }

  drawImage(p: any) {
    this.imageKernel(this.getGridInput(), this.width, this.height);
    const canvas = this.imageKernel.getCanvas();
    let context = (p.canvas as HTMLCanvasElement).getContext('2d');
    context.drawImage(canvas, 0, canvas.height - this.height, this.width, this.height, 0, 0, this.width, this.height);
    return null;
  }

  getGridInput() {
    if (this.grid.constructor.name === 'Texture') {
      return this.grid;
    }
    return inp(this.grid, [this.width * this.height * 2]);
  }

  private createCalcNextGpuKernel(): KernelFunction<ArrayLike<number> | GpuJsTexture> {
    const cellIndex = function (x, columnOffset, rowOffset, width, height) {
      return this.clamp(x + ((columnOffset * 2) + (rowOffset * width * 2)), 0, width * height * 2);
    };

    const calcWeightedSum = function (grid, weights: number[], x, width, height) {
      let sum = 0.0;
      sum += grid[cellIndex(x, -1, -1, width, height)] * weights[0];
      sum += grid[cellIndex(x, 0, -1, width, height)] * weights[1];
      sum += grid[cellIndex(x, 1, -1, width, height)] * weights[2];
      sum += grid[cellIndex(x, -1, 0, width, height)] * weights[3];
      sum += grid[cellIndex(x, 0, 0, width, height)] * weights[4];
      sum += grid[cellIndex(x, 1, 0, width, height)] * weights[5];
      sum += grid[cellIndex(x, -1, 1, width, height)] * weights[6];
      sum += grid[cellIndex(x, 0, 1, width, height)] * weights[7];
      sum += grid[cellIndex(x, 1, 1, width, height)] * weights[8];
      return sum;
    };

    const calcNextA = function (a, dA, laplaceA, abb, f) {
      const nextA = a +
        (dA * laplaceA) -
        abb +
        (f * (1 - a));
      return Math.min(1.0, Math.max(0.0, nextA));
    };

    const calcFluidBToAdd = function (grid, x, y, radius, width) {
      // even cells are for fluid A. Odd cells are fluid B.
      const isFluidB = this.mod(this.thread.x, 2.0);
      const col = (this.thread.x / 2) % width;
      const row = this.thread.x / (width * 2);
      const i = Math.abs(x - col);
      const j = Math.abs(y - row);
      const radPos = (i * i) + (j * j);

      // we only want to change values for fluid B (oddEvenMod = 1) and when radius > radPos.
      const isInRadiusAndFluidB = isFluidB * this.step(radPos, radius * radius);

      const fluidBToAdd = isInRadiusAndFluidB * (this.smoothstep(radius * radius, radPos, 0.0));
      return this.clamp(fluidBToAdd, 0.0, 1.0);
    };

    return this.gpuJs.createKernel(
      function (grid, weights: number[], calcParams: number[], addChemicalsParams: [number, number, number, number]) {
        const dA = calcParams[0];
        const dB = calcParams[1];
        const f = calcParams[2];
        const k = calcParams[3];
        const width = calcParams[4];
        const height = calcParams[5];

        const dynkillfeed = calcParams[6];
        const oddEvenMod = this.thread.x % 2;
        const indexA = this.thread.x - oddEvenMod;
        const indexB = indexA + 1;
        const a = grid[indexA];
        let b = grid[indexB];
        const xNormed = Math.floor((this.thread.x / 2) % width) / width;
        const yNormed = Math.floor((this.thread.x / 2) / width) / height;

        const [x, y, radius, addChems] = addChemicalsParams;

        b = b + (addChems * calcFluidBToAdd(grid, x, y, radius, width));

        const kT = this.mix(k, k + (xNormed * 0.025), dynkillfeed);
        const fT = this.mix(f, (f + 0.09) + (yNormed * -0.09), dynkillfeed);

        const laplaceA = calcWeightedSum(grid, weights, indexA, width, height);
        const laplaceB = calcWeightedSum(grid, weights, indexB, width, height);

        const abb = a * b * b;

        const result = (oddEvenMod - 1) * -calcNextA(a, dA, laplaceA, abb, fT)
          + (oddEvenMod * (b + (dB * laplaceB) + abb - ((kT + fT) * b)));

        return this.clamp(result, 0, 1);

      }
      , {output: [this.width * this.height * 2]})
      .setFloatTextures(true)
      .setFloatOutput(true)
      .setOutputToTexture(true)
      .setFunctions([calcWeightedSum, cellIndex, calcNextA, calcFluidBToAdd]);
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
      , {output: [this.width, this.height]})
      .setFloatTextures(true)
      .setGraphical(true);
  }

  /*  private createCalcNextMultiKernel() {
      let kernels = [];
      for (let i = 0; i < this.speed; i++) {
        kernels.push(this.createCalcNextGpuKernel());
      }

      this.gpuJs.combineKernels(kernels, function(grid, weights: number[], calcParams: number[], addChemicalsParams: [number, number, number, number]){
        let result = grid;
        for(let i=0; i < this.constants.kernels; i++){
          result = kernels[i](result, weights,calcParams, addChemicalsParams);
        }
        return result;
      })
        .setConstants({ kernels: this.speed });

    }*/
}
