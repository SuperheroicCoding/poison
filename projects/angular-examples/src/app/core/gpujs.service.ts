import {Injectable} from '@angular/core';
import {GPU, IGPUKernelSettings, IKernelRunShortcut, KernelFunction} from 'gpu.js';

@Injectable()
export class GpuJsService {

  private delegateGPU: GPU;

  constructor() {
    const mode = 'gpu';
    this.delegateGPU = new GPU({mode});
  }

  createKernel(kernelFunction: KernelFunction, settings?: IGPUKernelSettings): IKernelRunShortcut {
    return this.delegateGPU.createKernel(kernelFunction, settings);
  }

  setUseGPU(useGPU: boolean = true): GpuJsService {
    this.delegateGPU = new GPU({mode: useGPU ? 'gpu' : 'cpu'});
    return this;
  }

}

