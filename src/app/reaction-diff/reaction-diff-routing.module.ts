import {ModuleWithProviders} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoadGpuKernelsResolver} from './load-gpu-kernels.resolver';
import {ReactionDiffComponent} from './reaction-diff.component';

const routes: Routes = [
  {
    path: '', component: ReactionDiffComponent,
    resolve: {
      kernels: LoadGpuKernelsResolver
    }
  },
];

export const reactionDiffRoutes: ModuleWithProviders = RouterModule.forChild(routes);

