import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FourierAnalysisComponent} from './fourier-analysis/fourier-analysis.component';

const routes: Routes = [
  {path: '', component: FourierAnalysisComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FourierAnalysisRoutingModule {
}


