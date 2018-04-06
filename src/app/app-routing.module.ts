import {Data, Route, RouterModule} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {InfoComponent} from './info/info.component';

export interface AppRouteData extends Data {
  linkText?: string;
}

export interface AppRoute extends Route {
  data?: AppRouteData;
}

export const routes: AppRoute[] = [
  {path: '', pathMatch: 'full', redirectTo: 'home'},
  {path: 'home', component: InfoComponent, data: {linkText: 'Home'}},
  {
    path: 'shaderExamples',
    loadChildren: 'app/shader-examples/shader-examples.module#ShaderExamplesModule',
    data: {linkText: 'WebGL Shader examples with live code editor'}
  },
  {
    path: 'someGpuCalculations',
    loadChildren: 'app/some-gpu-calculation/some-gpu-calculation.module#SomeGpuCalculationModule',
    data: {linkText: 'Some Gpu Accelerated Calculations'}
  },
  {
    path: 'webGl',
    loadChildren: 'app/web-gl/web-gl.module#WebGlModule',
    data: {linkText: 'Mandelbrot plane, lights objects with three.js'}
  },
  {
    path: 'neuralNetwork',
    loadChildren: 'app/neural-network/neural-network.module#NeuralNetworkModule',
    data: {linkText: 'Neural Networks'}
  },
  {
    path: 'reactionDiff',
    loadChildren: 'app/reaction-diff/reaction-diff.module#ReactionDiffModule',
    data: {linkText: 'Reaction Diffusion Algorithm'}
  },
  {
    path: 'poisson',
    loadChildren: 'app/poisson/poisson.module#PoissonModule',
    data: {linkText: 'Poisson Distribution Algorithm'}
  },
  {path: '**', redirectTo: 'home'}
];

export const appRoutes: ModuleWithProviders = RouterModule.forRoot(routes);

