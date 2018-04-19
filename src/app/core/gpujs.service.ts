import {Injectable} from '@angular/core';
import * as GpuJs from 'gpu.js';

export const inp: (array: ArrayLike<number> | GpuJsTexture, dimensions: number[] | { x: number, y?: number, z?: number }) => any = (GpuJs as any).input;

@Injectable()
export class GpuJsService implements GPUJS {

  private delegateGPU;

  constructor() {
    this.delegateGPU = new GpuJs();
  }

  createKernel(kernelFunction: Function | string, settings?: BuildKernelSettings): KernelFunction<ArrayLike<number>> {
    return this.delegateGPU.createKernel(kernelFunction, settings);
  }

  createKernelMap(kernels: { [key: string]: Function }, megaKernelFunc: Function): KernelFunction<{ [key: string]: ArrayLike<number> }> {
    return this.delegateGPU.createKernelMap(kernels, megaKernelFunc);
  }

  combineKernels(kernel1: KernelFunction<ArrayLike<number> | GpuJsTexture>, kernel2: KernelFunction<ArrayLike<number> | GpuJsTexture>, megaKernel: Function): KernelFunction<ArrayLike<number>> {
    return this.delegateGPU.combineKernels(kernel1, kernel2, megaKernel);
  }

  setUseGPU(useGPU: boolean = true): GPUJS {
    return this.delegateGPU = new GpuJs({mode: useGPU ? 'gpu' : 'cpu'}) as GPUJS;
  }


}

export interface BuildKernelSettings {
  mode?: 'gpu' | 'cpu';
  output?: number[];
}

export interface KernelFunction<T> {
  (arg?: any): T;

  (...argArray: any[]): T;

  setGraphical(on: boolean): GraphicalKernelFunction;

  setOutput(outputDef: number[]): this;

  setFloatTextures(activate: boolean): this;

  setFloatOutput(activate: boolean): this;

  setOutputToTexture(outputToTexture: boolean): TextureKernelFunction;

  setFunctions(functions: Function[] | { [key: string]: (...argArray: any[]) => number }): this;

  setConstants(constants: { [key: string]: number }): this;

}

export interface GraphicalKernelFunction extends KernelFunction<void> {
  getCanvas(): HTMLCanvasElement;
}

export interface TextureKernelFunction extends KernelFunction<GpuJsTexture> {
  detachTextureCache(): void;
}

export interface GPUJS {
  createKernel(kernelFunction: Function, parameters?: { mode: 'gpu' | 'cpu' }): KernelFunction<ArrayLike<number>>;

  createKernelMap(kernels: { [key: string]: Function }, megaKernel: Function): KernelFunction<{ [key: string]: ArrayLike<number> }>;

  combineKernels(kernel1: KernelFunction<GpuJsTexture>, kernel2: KernelFunction<GpuJsTexture>, megaKernel: Function): KernelFunction<ArrayLike<number>>;

}

export interface GpuJsTexture {
  delete();

  toArray(gpuJs: GPUJS): ArrayLike<number>;
}
