import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LearnedDigitsComponent} from './learned-digits/learned-digits.component';
import {PolynominalRegretionComponent} from './polynominal-regretion/polynominal-regretion.component';
import {TensorflowExamplesComponent} from './tensorflow-examples.component';

const routes: Routes = [{
  path: '', component: TensorflowExamplesComponent, children: [
    {path: 'polynominalregretion', component: PolynominalRegretionComponent},
    {path: 'learnedDigits', component: LearnedDigitsComponent},
    {path: '**', redirectTo: 'polynominalregretion'}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TensorflowExamplesRoutingModule {
}
