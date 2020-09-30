import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {AskForNumberDialogComponent} from './learned-digits/ask-for-number-dialog/ask-for-number-dialog';
import {DrawDigitComponent} from './learned-digits/draw-digit/draw-digit.component';
import {DrawPredictionsComponent} from './learned-digits/draw-predictions/draw-predictions.component';
import {LearnedDigitsComponent} from './learned-digits/learned-digits.component';
import {DataDrawerComponent} from './polynominal-regretion/data-drawer/data-drawer.component';
import {PolynomialRegressionComponent} from './polynominal-regretion/polynomial-regression.component';
import {TensorflowExamplesRoutingModule} from './tensorflow-examples-routing.module';
import {TensorflowExamplesComponent} from './tensorflow-examples.component';

@NgModule({
  imports: [
    SharedModule,
    TensorflowExamplesRoutingModule,
    HttpClientModule
  ],
  declarations: [
    PolynomialRegressionComponent,
    DataDrawerComponent,
    LearnedDigitsComponent,
    TensorflowExamplesComponent,
    DrawPredictionsComponent,
    DrawDigitComponent,
    AskForNumberDialogComponent]
})
export class TensorflowExamplesModule {
}
