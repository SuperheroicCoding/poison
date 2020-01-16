import {NgModule} from '@angular/core';
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

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReactionDiffRoutingModule {
}


