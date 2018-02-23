/* SystemJS module definition */
declare var module: NodeModule;

interface NodeModule {
  id: string;
}

declare module 'gpu.js';

interface KernelFunction {
  (arg?: any): any;
  (...argArray: any[]): any;
  setGraphical(on: boolean): KernelFunction;
  setOutput(outputDef: number[]):  KernelFunction;
  getCanvas(): HTMLCanvasElement;
  setOutputToTexture(outputToTexture: boolean);
}

interface GPU {
  createKernel(kernelFunction: Function, parameters?: {mode: 'gpu' | 'cpu'}): KernelFunction;
}
