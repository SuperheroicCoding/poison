import {Injectable} from '@angular/core';
import {GPU, IGPUKernelSettings, IGPUSettings, IKernelRunShortcut, KernelFunction} from 'gpu.js';

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

  setUseGPU(useGPU: boolean = true, settings?: Partial<IGPUSettings>): GpuJsService {
    this.delegateGPU = new GPU({mode: useGPU ? 'gpu' : 'cpu', ...settings});
    return this;
  }

}

