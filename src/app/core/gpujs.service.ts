import {Injectable} from '@angular/core';
import * as GpuJs from 'gpu.js';

export const inp: (array: ArrayLike<number>, dimensions: number[]) => any = (GpuJs as any).input;

@Injectable()
export class GpuJsService implements GPUJS {

  private delegateGPU;

  constructor() {
    this.delegateGPU = new GpuJs();
  }

  createKernel(kernelFunction: Function, parameters?: { mode: 'gpu' | 'cpu' }): KernelFunction {
    return this.delegateGPU.createKernel(kernelFunction, parameters);
  }

  createKernelMap(kernels: { [key: string]: Function }, megaKernelFunc: Function): KernelFunction {
    return this.delegateGPU.createKernelMap(kernels, megaKernelFunc);
  }

  combineKernels(kernel1: KernelFunction, kernel2: KernelFunction, megaKernel: Function) {
    return this.delegateGPU.combineKernels(kernel1, kernel2, megaKernel);
  }

  setUseGPU(useGPU: boolean = true): GPUJS {
    return this.delegateGPU = new GpuJs({mode: useGPU ? 'gpu' : 'cpu'}) as GPUJS;
  }



}

export interface KernelFunction {
  (arg?: any): any;

  (...argArray: any[]): any;

  setGraphical(on: boolean): KernelFunction;

  setOutput(outputDef: number[]): KernelFunction;

  setFloatTextures(activate: boolean): KernelFunction;

  getCanvas(): HTMLCanvasElement;

  setOutputToTexture(outputToTexture: boolean);

  setFunctions(functions: Function[]);


}

export interface GPUJS {
  createKernel(kernelFunction: Function, parameters?: { mode: 'gpu' | 'cpu' }): KernelFunction;

  createKernelMap(kernels: { [key: string]: Function }, megaKernel: Function): KernelFunction;

  combineKernels(kernel1: KernelFunction, kernel2: KernelFunction, megaKernel: Function);

}

export interface GpuJsTexture {
  delete();

  toArray(gpuJs: GPUJS);
}
