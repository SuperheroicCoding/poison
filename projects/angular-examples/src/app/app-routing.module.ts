import {ModuleWithProviders} from '@angular/core';
import {Data, Route, RouterModule} from '@angular/router';
import {IsAuthenticatedGuard} from './core/guards/is-authenticated-guard.service';
import {InfoComponent} from './info/info.component';

export interface AppRouteData extends Data {
  linkText?: string;
}

export interface AppRoute extends Route {
  data?: AppRouteData;
}

export const routes: AppRoute[] = [
  {path: 'home', component: InfoComponent, data: {linkText: 'Home'}},
  {
    path: 'fourierAnalysis',
    loadChildren: './fourier-analysis/fourier-analysis.module#FourierAnalysisModule',
    data: {linkText: 'Fourier Analysis Example'}
  },
  {
    path: 'bacteriaGame',
    loadChildren: './bacteria-game/bacteria-game.module#BacteriaGameModule',
    data: {linkText: 'Bacteria Game'}
  },
  {
    path: 'shaderExamples',
    loadChildren: './shader-examples/shader-examples.module#ShaderExamplesModule',
    data: {linkText: 'WebGL Shader examples with live code editor (three.js)'},
    canLoad: [IsAuthenticatedGuard]
  },
  {
    path: 'someGpuCalculations',
    loadChildren: './some-gpu-calculation/some-gpu-calculation.module#SomeGpuCalculationModule',
    data: {linkText: 'Some Gpu Accelerated Calculations (gpu.js)'}
  },
  {
    path: 'webGl',
    loadChildren: './web-gl/web-gl.module#WebGlModule',
    data: {linkText: 'Mandelbrot plane, lights objects (three.js)'}
  },
  {
    path: 'tensorflowExamples',
    loadChildren: './tensorflow-examples/tensorflow-examples.module#TensorflowExamplesModule',
    data: {linkText: 'Tensorflow examples'}
  },
  {
    path: 'neuralNetwork',
    loadChildren: './neural-network/neural-network.module#NeuralNetworkModule',
    data: {linkText: 'Neural Networks (p5)'}
  },
  {
    path: 'reactionDiff',
    loadChildren: './reaction-diff/reaction-diff.module#ReactionDiffModule',
    data: {linkText: 'Reaction Diffusion Algorithm (gpu.js)'}
  },
  {
    path: 'poisson',
    loadChildren: './poisson/poisson.module#PoissonModule',
    data: {linkText: 'Poisson Distribution Algorithm'}
  }, {
    path: 'performanceTests',
    loadChildren: './performance-test/performance-test.module#PerformanceTestModule',
    data: {linkText: 'Performance Tests'}
  },
  {
    path: 'webassemblyTests',
    loadChildren: './wasm-test/wasm-test.module#WasmTestModule',
    data: {linkText: 'Web Assembly Tests'}
  },
  {path: '**', redirectTo: '/home'}
];

export const appRoutes: ModuleWithProviders = RouterModule.forRoot(routes);

