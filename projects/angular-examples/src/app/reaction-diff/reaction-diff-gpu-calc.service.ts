import {IKernelRunShortcut, KernelOutput, Texture} from 'gpu.js';
import p5, {Graphics} from 'p5';
import {ReactionDiffCalcParams} from './reaction-diff-calc-params';
import {CellWeights, weightsToArray} from './cell-weights';
import {ReactionDiffCalculator} from './reaction-diff-calculator';
import {Observable} from 'rxjs';
import {GpuJsService} from '../core/gpujs.service';
import {ReactionDiffKernelModules} from './reaction-diff-window';

export class ReactionDiffGpuCalcService implements ReactionDiffCalculator {

  numberThreads = 1;
  private lastNextCalc = 0;
  private weights: number[];
  private addChemicalRadius: number;
  private calcNextKernels: { first: IKernelRunShortcut, second: IKernelRunShortcut };
  private speed: number;
  private imageKernel: IKernelRunShortcut;
  private calcParams: ReactionDiffCalcParams;
  private nextAddChemicals: (number | number | number | number)[] = [0, 0, 0, 0];
  private nextImage: HTMLCanvasElement;
  private initGridKernel: IKernelRunShortcut;
  private initialized = false;
  private grid: Texture;

  constructor(private width: number,
              private height: number,
              calcParams$: Observable<ReactionDiffCalcParams>,
              calcCellWeights$: Observable<CellWeights>,
              addChemicalRadius$: Observable<number>,
              speed$: Observable<number>,
              private gpuJs: GpuJsService,
              private kernels: ReactionDiffKernelModules) {
    this.gpuJs.setUseGPU(true);
    calcParams$.subscribe((calcParams) => {
      this.setCalcParams(calcParams);
    });
    calcCellWeights$.subscribe((weights) => this.setWeights(weights));
    addChemicalRadius$.subscribe((radius) => this.addChemicalRadius = radius);
    speed$.subscribe((speed) => this.speed = speed);
    const calcNextModule = this.kernels.calcNextKernelModule;
    calcNextModule.usedFunctions.forEach((usedFunction, index) => {
      this.gpuJs.addFunction(usedFunction, calcNextModule.usedFunctionTypes[index]);
    });
    this.init();
  }

  reset(): void {
    this.initGrid();
    this.addChemical(this.width / 2, this.height / 2);
  }

  private init() {
    this.initGrid();

    const first: IKernelRunShortcut = this.createCalcNextGpuKernel();
    const second: IKernelRunShortcut = this.createCalcNextGpuKernel();
    this.calcNextKernels = {
      first,
      second
    };
    this.imageKernel = this.createImageKernel();
    this.addChemical(this.width / 2, this.height / 2);
    this.initialized = true;
  }

  addChemical(x: number, y: number): void {
    const r = this.addChemicalRadius;
    this.nextAddChemicals = [x, y, r, 1.0];
    this.calcNext(1);
  }

  resize(width: number, height: number): void {
    this.initialized = false;
    this.width = width;
    this.height = height;
    (this.grid as Texture).delete();
    this.initGridKernel = null;
    this.init();
  }

  calcNext(repeat: number = this.speed): void {
    const calcParams = [
      this.calcParams.diffRateA,
      this.calcParams.diffRateB,
      this.calcParams.feedRate,
      this.calcParams.killRate,
      this.calcParams.dynamicKillFeed ? 1. : 0.
    ];

    for (let i = 0; i < repeat; i++) {
      // using texture swap to prevent input texture == output texture webGl error;
      const calcKernel = this.lastNextCalc === 0 ? this.calcNextKernels.first : this.calcNextKernels.second;
      const nextCalcResult = calcKernel(
        this.grid,
        this.weights,
        calcParams,
        this.nextAddChemicals
      ) as Texture;
      // this.grid.delete();
      this.grid = nextCalcResult;
      this.lastNextCalc = (this.lastNextCalc + 1) % 2;
      this.nextAddChemicals = [0., 0., 0., 0.];
    }
  }

  initGrid() {
    if (!this.initGridKernel) {
      this.initGridKernel = this.gpuJs.createKernel(function initGrid() {
        return 1.0 - (this.thread.z % 2);
      })
        .setOutput([this.width, this.height, 2])
        .setPipeline(true);
    }
    this.grid = this.initGridKernel() as Texture;
  }

  private setWeights(weights: CellWeights) {
    this.weights = weightsToArray(weights);
  }

  private setCalcParams(calcParams: ReactionDiffCalcParams) {
    this.calcParams = calcParams;
  }

  drawImage(p: { canvas: HTMLCanvasElement }) {
    if (!this.initialized) {
      return;
    }
    if (!this.nextImage) {
      this.calcNext(1);
    }
    this.imageKernel(this.grid);
    this.nextImage = this.imageKernel.canvas;
    const context = p.canvas.getContext('2d');
    context.drawImage(this.nextImage, 0, this.nextImage.height - this.height, this.width, this.height, 0, 0, this.width, this.height);
  }

  cleanup() {
    this.initialized = false;
    this.grid?.delete();
    this.calcNextKernels?.first?.destroy();
    this.calcNextKernels?.second?.destroy();
    this.calcNextKernels = null;
    this.initGridKernel?.destroy();
    this.initGridKernel = null;
    this.imageKernel?.destroy();
    this.imageKernel = null;
    this.lastNextCalc = 0;
    this.nextImage = null;
  }

  private createCalcNextGpuKernel(): IKernelRunShortcut {
    const calcNextModule = this.kernels.calcNextKernelModule;
    return this.gpuJs.createKernel(calcNextModule.calcNextKernel,
      {output: [this.width, this.height, 2]})
      .setPipeline(true)
      .setConstants({width: this.width, height: this.height});
  }

  private createImageKernel(): IKernelRunShortcut {
    const kernelModule = this.kernels.imageKernelModule;
    return this.gpuJs.createKernel(kernelModule.imageKernel)
      .setOutput([this.width, this.height])
      .setFunctions(kernelModule.usedFunctions)
      .setGraphical(true);
  }

  updateNumberThreads(numberWebWorkers: number): void {
    // nothing to do here.
  }
}
