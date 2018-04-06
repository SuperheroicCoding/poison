import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TensorflowExamplesComponent} from './tensorflow-examples.component';

const routes: Routes = [
  {path: '', component: TensorflowExamplesComponent}
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TensorflowExamplesRoutingModule {
}
