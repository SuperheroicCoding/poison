import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {DrawDigitComponent} from './learned-digits/draw-digit/draw-digit.component';
import {LearnedDigitsModelService} from './learned-digits/learned-digits-model.service';
import {LearnedDigitsComponent} from './learned-digits/learned-digits.component';
import {MnistDataService} from './learned-digits/mnist-data.service';
import {UiComponent} from './learned-digits/ui/ui.component';
import {DataDrawerComponent} from './polynominal-regretion/data-drawer/data-drawer.component';
import {DataDrawerService} from './polynominal-regretion/data-drawer/data-drawer.service';
import {DataGeneratorService} from './polynominal-regretion/data-generator.service';
import {PolynominalRegretionComponent} from './polynominal-regretion/polynominal-regretion.component';
import {PolynominalRegretionService} from './polynominal-regretion/polynominal-regretion.service';
import {TensorflowExamplesRoutingModule} from './tensorflow-examples-routing.module';
import {TensorflowExamplesComponent} from './tensorflow-examples.component';

@NgModule({
  imports: [
    SharedModule,
    TensorflowExamplesRoutingModule,
    HttpClientModule
  ],
  providers: [
    DataGeneratorService,
    PolynominalRegretionService,
    DataDrawerService,
    MnistDataService,
    LearnedDigitsModelService],
  declarations: [
    PolynominalRegretionComponent,
    DataDrawerComponent,
    LearnedDigitsComponent,
    TensorflowExamplesComponent,
    UiComponent,
    DrawDigitComponent]
})
export class TensorflowExamplesModule {
}
