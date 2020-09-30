import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LearnedDigitsComponent} from './learned-digits/learned-digits.component';
import {PolynomialRegressionComponent} from './polynominal-regretion/polynomial-regression.component';
import {TensorflowExamplesComponent} from './tensorflow-examples.component';

const routes: Routes = [{
  path: '', component: TensorflowExamplesComponent, children: [
    {path: 'polynomialregression', component: PolynomialRegressionComponent},
    {path: 'learnedDigits', component: LearnedDigitsComponent},
    {path: '', redirectTo: 'polynomialregression', pathMatch: 'full'}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TensorflowExamplesRoutingModule {
}
