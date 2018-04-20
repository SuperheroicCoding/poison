/* SystemJS module definition */
declare var module: NodeModule;

interface NodeModule {
  id: string;
}

declare module 'gpu.js';

declare module 'vega' {
  export * from 'vega-typings';
}

declare var Detector: any;


