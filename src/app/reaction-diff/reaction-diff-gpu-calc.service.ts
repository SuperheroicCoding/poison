import {ReactionDiffCalcParams} from './reaction-diff-calc-params';
import {CellWeights, weightsToArray} from './cell-weights';
import {ReactionDiffCalculator} from './reaction-diff-calculator';
import {Observable} from 'rxjs/Observable';
import {GpuJsService, GpuJsTexture, GraphicalKernelFunction, inp, TextureKernelFunction} from '../core/gpujs.service';
import {HeadlineAnimationService} from '../core/headline-animation.service';

export class ReactionDiffGpuCalcService implements ReactionDiffCalculator {
  grid: GpuJsTexture;
  numberThreads = 1;
  private lastNextCalc = 0;
  private weights: number[];
  private addChemicalRadius: number;
  private calcNextKernels: TextureKernelFunction[] = [];
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
    this.calcNextKernels = [];
    this.calcNextKernels.push(this.createCalcNextGpuKernel());
    this.calcNextKernels.push(this.createCalcNextGpuKernel());
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
    performance.mark('calcNext-start');
    let calcParams = [
      this.calcParams.diffRateA,
      this.calcParams.diffRateB,
      this.calcParams.feedRate,
      this.calcParams.killRate,
      this.calcParams.dynamicKillFeed
    ];

    for (let i = 0; i < repeat; i++) {
      // using texture swap to prevent input texture == output texture webGl error;
      this.grid = this.calcNextKernels[this.lastNextCalc](
        this.getGridInput(),
        this.weights,
        calcParams,
        this.nextAddChemicals
      );
      this.lastNextCalc = (this.lastNextCalc + 1) % 2;
      this.nextAddChemicals = [0, 0, 0, 0];
    }

    this.imageKernel(this.getGridInput());
    this.nextImage = this.imageKernel.getCanvas();

    performance.mark('calcNext-end');
    performance.measure('calcNext', 'calcNext-start', 'calcNext-end');
  }

  initGrid() {

    if (!this.initGridKernel) {
      const random = function (seed1, seed2) {
        return this.fract(this.sin(this.dot(this.vec2(seed1, seed2), this.vec2(12.9898, 78.233))) * 43758.5453123);
      };

      this.initGridKernel = this.gpuJs.createKernel(function () {
        return 1.0 - this.thread.z % 2.0 * (1.0 - random(this.thread.x, this.thread.y) * 0.05);
      })
        .setOutput([this.width, this.height, 2])
        .setFunctions([random])
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

  getGridInput() {
    if (this.grid.constructor.name === 'Texture') {
      return this.grid;
    }
    return inp(this.grid, {x: this.width, y: this.height, z: 2});
  }

  private createCalcNextGpuKernel(): TextureKernelFunction {

    const whenGt = function (value: number, value2: number): number {
      return Math.max(Math.sign(value - value2), 0.0);
    };

    const whenLt = function (value: number, value2: number): number {
      return Math.max(Math.sign(value2 - value), 0.0);
    };

    const whenGe = function (value: number, value2: number): number {
      return 1.0 - Math.max(Math.sign(value2 - value), 0.0);
    };

    const whenLe = function (value: number, value2: number): number {
      return 1.0 - Math.max(Math.sign(value - value2), 0.0);
    };

    const and = function (a: number, b: number): number {
      return a * b;
    };

    const wrapAround = function (value, value2) {
      const greater = whenGe(value, value2);
      const smallerZero = whenLe(value, 0.0);
      const inBetween = and(whenGe(value, 0.0), whenLt(value, value2));
      return (greater * (value - value2)) + (smallerZero * (value2 - value)) + (inBetween * value);
    };

    const cellValue = function (grid, fluid, columnOffset, rowOffset): number {
      const yIndex = Math.floor(wrapAround(this.thread.y + rowOffset, this.constants.height));
      const xIndex = Math.floor(wrapAround(this.thread.x + columnOffset, this.constants.width));
      return grid[fluid][yIndex][xIndex];
    };

    const calcWeightedSum = function (grid, fluid, weights: number[]) {
      let sum = 0.0;
      sum += cellValue(grid, fluid, -1.0, 1.0) * weights[0];
      sum += cellValue(grid, fluid, 0.0, 1.0) * weights[1];
      sum += cellValue(grid, fluid, 1, 1.0) * weights[2];
      sum += cellValue(grid, fluid, -1.0, 0.0) * weights[3];
      sum += cellValue(grid, fluid, 0.0, 0.0) * weights[4];
      sum += cellValue(grid, fluid, 1, 0.0) * weights[5];
      sum += cellValue(grid, fluid, -1.0, -1) * weights[6];
      sum += cellValue(grid, fluid, 0.0, -1) * weights[7];
      sum += cellValue(grid, fluid, 1, -1) * weights[8];
      return sum;
    };

    const calcNextA = function (a, dA, laplaceA, abb, f) {
      const nextA = a +
        (dA * laplaceA) -
        abb +
        (f * (1 - a));
      return  nextA;
    };

    const calcFluidBToAdd = function (grid, x, y, radius): number {
      // even cells are for fluid A. Odd cells are fluid B.
      const isFluidB = this.mod(this.thread.z, 2.0);
      const i = Math.abs(x - this.thread.x);
      const j = Math.abs(y - (this.constants.height - this.thread.y));
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
        const dynkillfeed = calcParams[4];


        const xNormed = this.thread.x / this.constants.width;
        const yNormed = this.thread.y / this.constants.height;

        const [x, y, radius, addChems] = addChemicalsParams;


        // we calculate k and f deepending on x, y when dynkillfeed = 1
        const kT = this.mix(k, k + (xNormed * 0.025), dynkillfeed);
        const fT = this.mix(f, (f + 0.09) + (yNormed * -0.09), dynkillfeed);

        const laplaceA = calcWeightedSum(grid, 0.0, weights);
        const laplaceB = calcWeightedSum(grid, 1.0, weights);

        const a = grid[0][this.thread.y][this.thread.x];
        let b = grid[1][this.thread.y][this.thread.x];
        b = b + (addChems * calcFluidBToAdd(grid, x, y, radius));
        const abb = a * b * b;

        const result = (this.thread.z - 1) * -calcNextA(a, dA, laplaceA, abb, fT)
          + (this.thread.z * (b + (dB * laplaceB) + abb - ((kT + fT) * b)));

        return this.clamp(result, 0, 1);

      }, {output: [this.width, this.height, 2]})
      .setFloatTextures(true)
      .setFloatOutput(true)
      .setOutputToTexture(true)
      .setConstants({width: this.width, height: this.height})
      .setFunctions([
          wrapAround,
          cellValue,
          calcWeightedSum,
          calcNextA,
          calcFluidBToAdd,
          whenLe,
          whenGe,
          whenLt,
          whenGt,
          and
        ]
      );
  }

  private createImageKernel() {

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

  updateNumberThreads(numberWebWorkers: number): void {
    // nothing to do here.
  }
}
