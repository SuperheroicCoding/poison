import {GPUFunction, IGPUFunction, IGPUFunctionSettings, KernelFunction} from 'gpu.js';

export interface ReactionDiffKernelModules {
  calcNextKernelModule: { calcNextKernel: KernelFunction, usedFunctions: Function[] };
  imageKernelModule: { imageKernel: KernelFunction, usedFunctions: Function[] };
}
