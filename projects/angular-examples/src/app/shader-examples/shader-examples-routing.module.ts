import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {IsAuthenticatedGuard} from '../core/guards/is-authenticated-guard.service';
import {ShaderExamplesComponent} from './shader-examples.component';

const routes: Routes = [
  {
    path: '',
    component: ShaderExamplesComponent,
    canActivate: [IsAuthenticatedGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShaderExamplesRoutingModule {
}
