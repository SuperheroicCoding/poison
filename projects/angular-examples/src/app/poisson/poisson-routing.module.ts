import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PoissonComponent} from './poisson.component';

const routes: Routes = [
  {path: '', component: PoissonComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PoissonRoutingModule {
}


