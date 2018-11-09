export interface ReactionDiffKernelModules {
  calcNextKernelModule: { calcNextKernel: Function, usedFunctions: Function[] };
  imageKernelModule: { imageKernel: Function, usedFunctions: Function[] };
}
