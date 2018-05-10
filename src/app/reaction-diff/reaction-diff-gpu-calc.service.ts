import {ReactionDiffCalcParams} from './reaction-diff-calc-params';
import {CellWeights, weightsToArray} from './cell-weights';
import {ReactionDiffCalculator} from './reaction-diff-calculator';
import {Observable} from 'rxjs';
import {GpuJsService, GpuJsTexture, GraphicalKernelFunction, TextureKernelFunction} from '../core/gpujs.service';

export class ReactionDiffGpuCalcService implements ReactionDiffCalculator {
  grid: GpuJsTexture;
  numberThreads = 1;
  private lastNextCalc = 0;
  private weights: number[];
  private addChemicalRadius: number;
  private calcNextKernels: { first: TextureKernelFunction, second: TextureKernelFunction };
  private speed: number;
  private imageKernel: GraphicalKernelFunction;
  private calcParams: ReactionDiffCalcParams;
  private nextAddChemicals: (number | number | number | number)[] = [0, 0, 0, 0];
  private nextImage: HTMLCanvasElement;
  private initGridKernel: TextureKernelFunction;

  constructor(private width: number,
              private height: number,
              calcParams$: Observable<ReactionDiffCalcParams>,
              calcCellWeights$: Observable<CellWeights>,
              addChemicalRadius$: Observable<number>,
              speed$: Observable<number>,
              private  gpuJs: GpuJsService) {
    calcParams$.subscribe((calcParams) => {
      this.setCalcParams(calcParams);
    });
    calcCellWeights$.subscribe((weights) => this.setWeights(weights));
    addChemicalRadius$.subscribe((radius) => this.addChemicalRadius = radius);
    speed$.subscribe((speed) => this.speed = speed);
    this.init();
  }

  reset(): void {
    this.initGrid();
    this.addChemical(this.width / 2, this.height / 2);
  }

  private init(): void {
    this.initGrid();
    this.calcNextKernels = {
      first: this.createCalcNextGpuKernel(), second: this.createCalcNextGpuKernel()
    };
    this.createImageKernel();
    this.addChemical(this.width / 2, this.height / 2);
  }

  addChemical(x: number, y: number): void {
    const r = this.addChemicalRadius;
    this.nextAddChemicals = [x, y, r, 1.0];
    this.calcNext(1);
  }

  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    this.grid.delete();
    this.initGridKernel = null;
    this.init();
  }

  calcNext(repeat: number = this.speed): void {
    const calcParams = [
      this.calcParams.diffRateA,
      this.calcParams.diffRateB,
      this.calcParams.feedRate,
      this.calcParams.killRate,
      this.calcParams.dynamicKillFeed
    ];

    for (let i = 0; i < repeat; i++) {
      // using texture swap to prevent input texture == output texture webGl error;

      const calcKernel = this.lastNextCalc === 0 ? this.calcNextKernels.first : this.calcNextKernels.second;

      this.grid = calcKernel(
        this.grid,
        this.weights,
        calcParams,
        this.nextAddChemicals
      );
      this.lastNextCalc = (this.lastNextCalc + 1) % 2;
      this.nextAddChemicals = [0, 0, 0, 0];
    }
    this.imageKernel(this.grid);
    this.nextImage = this.imageKernel.getCanvas();
  }

  initGrid() {

    if (!this.initGridKernel) {
      this.initGridKernel = this.gpuJs.createKernel(function initGrid() {
        return 1.0 - (this.thread.z % 2.0);
      })
        .setOutput([this.width, this.height, 2])
        .setFloatOutput(true)
        .setFloatTextures(true)
        .setOutputToTexture(true);
    }
    this.grid = this.initGridKernel();
  }

  private setWeights(weights: CellWeights) {
    this.weights = weightsToArray(weights);
  }

  private setCalcParams(calcParams: ReactionDiffCalcParams) {
    this.calcParams = calcParams;
  }

  drawImage(p: any) {
    if (!this.nextImage) {
      this.calcNext(1);
    }
    const context = (p.canvas as HTMLCanvasElement).getContext('2d');
    context.drawImage(this.nextImage, 0, this.nextImage.height - this.height, this.width, this.height, 0, 0, this.width, this.height);
  }

  cleanup() {
    this.calcNextKernels = null;
    this.initGridKernel = null;
    this.imageKernel = null;
    this.lastNextCalc = 0;
    this.nextImage = null;
    this.grid.delete();
  }

  private createCalcNextGpuKernel(): TextureKernelFunction {

    function whenGt(value: number, value2: number): number {
      return Math.max(Math.sign(value - value2), 0.0);
    }

    function whenLt(value: number, value2: number): number {
      return Math.max(Math.sign(value2 - value), 0.0);
    }

    function whenGe(value: number, value2: number): number {
      return 1.0 - Math.max(Math.sign(value2 - value), 0.0);
    }

    function whenLe(value: number, value2: number): number {
      return 1.0 - Math.max(Math.sign(value - value2), 0.0);
    }

    function and(a: number, b: number): number {
      return a * b;
    }

    function smoothy(lowLim: number, highLim: number, value: number): number {
      return limit((value - lowLim) / (highLim - lowLim), 0.0, 1.0);
    }

    function limit(value, lowLim, highLim) {
      return Math.max(Math.min(value, highLim), lowLim);
    }

    function mixValues(value, value2, ratio) {
      return (value * (1.0 - ratio)) + (value2 * ratio);
    }

    function wrapAround(value, value2) {
      const greater = whenGe(value, value2);
      const smallerZero = whenLt(value, 0.0);
      const inBetween = and(whenGe(value, 0.0), whenLt(value, value2));
      return (greater * (value - value2)) + (smallerZero * (value2 + value)) + (inBetween * value);
    }

    function cellValue(grid, fluid, columnOffset, rowOffset): number {
      const yIndex = wrapAround(this.thread.y + rowOffset, this.constants.height);
      const xIndex = wrapAround(this.thread.x + columnOffset, this.constants.width);
      return grid[fluid][yIndex][xIndex];
    }

    function calcWeightedSum(grid, fluid, weights: number[]) {
      return cellValue(grid, fluid, -1.0, 1.0) * weights[0] +
        cellValue(grid, fluid, 0.0, 1.0) * weights[1] +
        cellValue(grid, fluid, 1, 1.0) * weights[2] +
        cellValue(grid, fluid, -1.0, 0.0) * weights[3] +
        cellValue(grid, fluid, 0.0, 0.0) * weights[4] +
        cellValue(grid, fluid, 1, 0.0) * weights[5] +
        cellValue(grid, fluid, -1.0, -1) * weights[6] +
        cellValue(grid, fluid, 0.0, -1) * weights[7] +
        cellValue(grid, fluid, 1, -1) * weights[8];
    }

    function calcNextA(a, dA, laplaceA, abb, f) {
      return a +
        (dA * laplaceA) -
        abb +
        (f * (1 - a));
    }

    function calcFluidBToAdd(grid, x, y, radius): number {
      // even cells are for fluid A. Odd cells are fluid B.
      const isFluidB = this.thread.z % 2.0;
      const i = Math.abs(x - this.thread.x);
      const j = Math.abs(y - (this.constants.height - this.thread.y));
      const radPos = (i * i) + (j * j);

      // we only want to change values for fluid B (oddEvenMod = 1) and when radius² >= radPos.
      const fluidBToAdd = isFluidB * smoothy(radius * radius, 0, radPos);
      return limit(fluidBToAdd, 0.0, 1.0);
    }

    return this.gpuJs.createKernel(
      function calcNextKernel(grid, weights: number[], calcParams: number[], addChemicalsParams: [number, number, number, number]) {
        const dA = calcParams[0];
        const dB = calcParams[1];
        const f = calcParams[2];
        const k = calcParams[3];
        const dynkillfeed = calcParams[4];

        const xNormed = this.thread.x / this.constants.width;
        const yNormed = this.thread.y / this.constants.height;

        const [x, y, radius, addChems] = addChemicalsParams;

        // we calculate k and f deepending on x, y when dynkillfeed = 1
        const kT = mixValues(k, k + (xNormed * 0.025), dynkillfeed);
        const fT = mixValues(f, (f + 0.09) + (yNormed * -0.09), dynkillfeed);

        const laplaceA = calcWeightedSum(grid, 0.0, weights);
        const laplaceB = calcWeightedSum(grid, 1.0, weights);

        const a = grid[0][this.thread.y][this.thread.x];
        const b = grid[1][this.thread.y][this.thread.x] + (addChems * calcFluidBToAdd(grid, x, y, radius));
        const abb = a * b * b;

        const fluid = (this.thread.z - 1) * -calcNextA(a, dA, laplaceA, abb, fT)
          + (this.thread.z * (b + (dB * laplaceB) + abb - ((kT + fT) * b)));

        return limit(fluid, 0, 1);

      }, {output: [this.width, this.height, 2]})
      .setFloatTextures(true)
      .setFloatOutput(true)
      .setOutputToTexture(true)
      .setConstants({width: this.width, height: this.height})
      .setFunctions({
          whenLe: whenLe,
          whenGe: whenGe,
          whenLt: whenLt,
          whenGt: whenGt,
          and: and,
          limit: limit,
          smoothy: smoothy,
          mixValues: mixValues,
          wrapAround: wrapAround,
          cellValue: cellValue,
          calcWeightedSum: calcWeightedSum,
          calcNextA: calcNextA,
          calcFluidBToAdd: calcFluidBToAdd
        }
      );
  }

  private createImageKernel() {

    function mixValues(value1, value2, ratio) {
      return (value1 * (1.0 - ratio)) + (value2 * ratio);
    }

    this.imageKernel = this.gpuJs.createKernel(
      function (grid) {
        const aVal = grid[0][this.thread.y][this.thread.x];
        const bVal = grid[1][this.thread.y][this.thread.x];

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

        if (aVal === 0) {
          this.color(
            mixValues(rbg, rb, bVal),
            mixValues(gbg, gb, bVal),
            mixValues(bbg, bb, bVal));
        } else if (bVal === 0) {
          this.color(
            mixValues(rbg, ra, 0.5),
            mixValues(gbg, ga, 0.5),
            mixValues(bbg, ba, 0.5));
        } else if (aVal < bVal) {
          const rel = aVal / bVal;
          this.color(
            mixValues(rb, ra, rel),
            mixValues(gb, ga, rel),
            mixValues(bb, ba, rel)
          );
        } else {
          const rel2 = bVal / aVal;
          this.color(
            mixValues(ra, rb, rel2),
            mixValues(ga, gb, rel2),
            mixValues(ba, bb, rel2)
          );
        }
      }
      , {output: [this.width, this.height]})
      .setFloatTextures(true)
      .setFunctions([mixValues])
      .setGraphical(true);
  }

  updateNumberThreads(numberWebWorkers: number): void {
    // nothing to do here.
  }
}
