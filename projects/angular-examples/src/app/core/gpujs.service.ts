import {Injectable} from '@angular/core';
import {GPU, IGPUFunctionSettings, IGPUKernelSettings, IGPUSettings, IKernelRunShortcut, KernelFunction, ThreadFunction} from 'gpu.js';

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

  addFunction(kernelFunction: ThreadFunction, settings?: IGPUFunctionSettings): GpuJsService {
    this.delegateGPU.addFunction(kernelFunction as any, settings);
    return this;
  }

  createCombinedKernel(...kernels: any[]): IKernelRunShortcut {
    return this.delegateGPU.combineKernels(...kernels);
  }
}

