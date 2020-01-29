import {GPUFunction, IGPUFunction, IGPUFunctionSettings, KernelFunction, ThreadFunction} from 'gpu.js';

export interface ReactionDiffKernelModules {
  calcNextKernelModule: { calcNextKernel: KernelFunction, usedFunctions: ThreadFunction[], usedFunctionTypes: [IGPUFunctionSettings] };
  imageKernelModule: { imageKernel: KernelFunction, usedFunctions: Function[] };
}
