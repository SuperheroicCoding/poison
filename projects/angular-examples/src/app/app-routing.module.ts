import {ModuleWithProviders, NgModule} from '@angular/core';
import {Data, Route, RouterModule} from '@angular/router';
import {addImportToModule} from '@datorama/akita/schematics/ng-add/utils';
import {ROUTER_LINKS} from './router-links.token';
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
    loadChildren: async () => import('./fourier-analysis/fourier-analysis.module').then(m => m.FourierAnalysisModule),
    data: {linkText: 'Fourier Analysis Example'}
  },
  {
    path: 'bacteriaGame',
    loadChildren: async () => import('./bacteria-game/bacteria-game.module').then(m => m.BacteriaGameModule),
    data: {linkText: 'Bacteria Game'}
  },
  {
    path: 'shaderExamples',
    loadChildren: async () => import('./shader-examples/shader-examples.module').then(m => m.ShaderExamplesModule),
    data: {linkText: 'WebGL Shader examples with live code editor (three.js)'},
  },
  {
    path: 'someGpuCalculations',
    loadChildren: async () => import('./some-gpu-calculation/some-gpu-calculation.module').then(m => m.SomeGpuCalculationModule),
    data: {linkText: 'Some Gpu Accelerated Calculations (gpu.js)'}
  },
  {
    path: 'webGl',
    loadChildren: async () => import('./web-gl/web-gl.module').then(m => m.WebGlModule),
    data: {linkText: 'Mandelbrot plane, lights objects (three.js)'}
  },
  {
    path: 'tensorflowExamples',
    loadChildren: async () => import('./tensorflow-examples/tensorflow-examples.module').then(m => m.TensorflowExamplesModule),
    data: {linkText: 'Tensorflow examples'}
  },
  {
    path: 'neuralNetwork',
    loadChildren: async () => import('./neural-network/neural-network.module').then(m => m.NeuralNetworkModule),
    data: {linkText: 'Neural Networks (p5)'}
  },
  {
    path: 'reactionDiff',
    loadChildren: async () => import('./reaction-diff/reaction-diff.module').then(m => m.ReactionDiffModule),
    data: {linkText: 'Reaction Diffusion Algorithm (gpu.js)'}
  },
  {
    path: 'poisson',
    loadChildren: async () => import('./poisson/poisson.module').then(m => m.PoissonModule),
    data: {linkText: 'Poisson Distribution Algorithm'}
  }, {
    path: 'performanceTests',
    loadChildren: async () => import('./performance-test/performance-test.module').then(m => m.PerformanceTestModule),
    data: {linkText: 'Performance Tests'}
  },
  {
    path: 'webassemblyTests',
    loadChildren: async () => import('./wasm-test/wasm-test.module').then(m => m.WasmTestModule),
    data: {linkText: 'Web Assembly Tests'}
  },
  {path: '**', redirectTo: '/home'}
];


@NgModule({
  imports: [RouterModule.forRoot(routes, {paramsInheritanceStrategy: 'always'})],
  exports: [RouterModule],
  providers: [
    {
      provide: ROUTER_LINKS, useValue: routes.filter(route => route.data ? route.data.linkText : false)
    }],
})
export class AppRoutingModule {
}

