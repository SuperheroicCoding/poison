import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SomeGpuCalculationComponent} from './some-gpu-calculation.component';

const routes: Routes = [
  {path: '', component: SomeGpuCalculationComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SomeGpuCalculationRoutingModule {
}
