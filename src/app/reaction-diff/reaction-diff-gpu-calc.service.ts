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
    this.createCalcNextGpuKernel();
    this.createAddChemicalsKernel();
    this.createImageKernel();
    this.initGrid();
  }

  reset(): void {
    this.createCalcNextGpuKernel();
    this.createAddChemicalsKernel();
    this.createImageKernel();
    this.initGrid();
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
    this.createCalcNextGpuKernel();
    this.createAddChemicalsKernel();
    this.createImageKernel();
    this.initGrid();
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

  private getCell = (column: number, row: number): Cell => {
    const index = (column + row * this.width) * 2;
    return {
      a: this.grid[index], b: this.grid[index + 1]
    };
  };

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

  getImage(p: any) {
    this.imageKernel(inp(this.grid, [this.width * this.height * 2]));
    const canvas = this.imageKernel.getCanvas();
    const dataURL = canvas.toDataURL('image/png');
    const img = p.loadImage(dataURL);
    return img;
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

        const oddEvenMod = this.thread.x % 2;
        if (oddEvenMod === 0) {
          return grid[this.thread.x];
        }
        const col = (this.thread.x / 2) % width;
        const row = this.thread.x / (width * 2);
        const i = Math.abs(x - col);
        const j = Math.abs(y - row);
        const radPos = Math.sqrt((i * i) + (j * j));
        if (radPos > radius) {
          return grid[this.thread.x];
        }
        return Math.min(1, this.thread.x + (radius / ((radPos * radPos) + radius)));
      }
    )
      .setOutput([this.width * this.height * 2])
      .setFloatTextures(true);
  }

  private createImageKernel() {

    this.imageKernel = this.gpuJs.createKernel(
      function (grid) {
        const oddEvenMod = this.thread.x % 2;
        const indexA = this.thread.x - oddEvenMod;
        const indexB = indexA + 1;
        const aVal = grid[indexA];
        const bVal = grid[indexB];
        let r = 0;
        let g = 0;
        let b = 0;
        if (aVal === 0) {
          b = bVal;
        } else if (bVal === 0) {
          r = 0.5 * aVal;
          g = 0.5 * aVal;
          b = 0.8;
        } else {
          r = 0.5 * aVal;
          g = 0.5 * aVal;
          b = 0.4 + (0.5 * bVal);
        }
        this.color(r, g, b);
      }
    ).setFloatTextures(true)
      .setOutput([this.width, this.height, 3])
  }
}
