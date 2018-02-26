import {ReactionDiffCalcParams} from './reaction-diff-calc-params';
import {CellWeights, weightsToArray} from './cell-weights';
import {ReactionDiffCalculator} from './reaction-diff-calculator';
import {Observable} from 'rxjs/Observable';
import {Cell} from './cell';
import {input} from 'gpu.js/dist';

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

  constructor(private width: number, private height: number,
              calcParams$: Observable<ReactionDiffCalcParams>,
              calcCellWeights$: Observable<CellWeights>,
              addChemicalRadius$: Observable<number>, speed$: Observable<number>, private  gpuJs: GPU) {
    calcParams$.subscribe((calcParams) => this.setCalcParams(calcParams));
    calcCellWeights$.subscribe((weights) => this.setWeights(weights));
    addChemicalRadius$.subscribe((radius) => this.addChemicalRadius = radius);
    speed$.subscribe((speed) => this.speed = speed);

    this.initGrid();
    this.createCalcNextGpuKernel();
  }

  reset(): void {
    this.initGrid();
  }

  addChemical(x: number, y: number): void {
    const r = this.addChemicalRadius;
    for (let i = -r; i < r; i++) {
      for (let j = -r; j < r; j++) {
        const wrappedX = x + i < 0 ? this.width + i : (x + i) % this.width;
        const wrappedY = y + j < 0 ? this.height + j : (y + j) % this.height;
        const bToAdd = r / (i * i + j * j);
        const cell = this.getCell(wrappedX, wrappedY);
        this.setCell(wrappedX, wrappedY, {
          a: cell.a,
          b: Math.min(1.0, Math.max(0.0, cell.b + bToAdd))
        });
      }
    }
  }

  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    this.initGrid();
    this.createCalcNextGpuKernel();
  }

  updateNumberThreads(numberWebWorkers: number): void {
    // nothing to do here.
  }

  calcNext(): void {
    performance.mark('calcNext-start');
    for (let i = 0; i < this.speed; i++) {
      this.grid = this.calcNextKernel(input(this.grid, [this.width * this.height * 2]),
        this.weights, this.diffRateA, this.diffRateB, this.feedRate, this.killRate, this.width);
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
}
