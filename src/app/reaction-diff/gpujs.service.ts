import {Injectable} from '@angular/core';
import * as GpuJs from 'gpu.js/dist';
import {input} from 'gpu.js/dist';

export const inp: (array: ArrayLike<number>, dimensions: number[]) => any = input;

@Injectable()
export class GpuJsService implements GPU {

  private delegateGPU;

  createKernel(kernelFunction: Function, parameters?): KernelFunction {
    return this.delegateGPU.createKernel(kernelFunction, parameters);
  }

  constructor() {
    this.delegateGPU = new GpuJs();
  }

  setUseGPU(useGPU: boolean = true): GPU {
    return this.delegateGPU = new GpuJs({mode: useGPU ? 'gpu' : 'cpu'});
  }

}
