import {NgModule} from '@angular/core';
import {TensorflowExamplesRoutingModule} from './tensorflow-examples-routing.module';
import {PolynominalRegretionComponent} from './polynominal-regretion/polynominal-regretion.component';
import {DataDrawerComponent} from './data-drawer/data-drawer.component';
import {DataGeneratorService} from './polynominal-regretion/data-generator.service';
import {PolynominalRegretionService} from './polynominal-regretion/polynominal-regretion.service';
import {DataDrawerService} from './data-drawer/data-drawer.service';
import {SharedModule} from '../shared/shared.module';
import {LearnedDigitsComponent} from './learned-digits/learned-digits.component';
import {TensorflowExamplesComponent} from './tensorflow-examples.component';
import {MnistDataService} from './learned-digits/mnist-data.service';
import {LearnedDigitsModelService} from './learned-digits/learned-digits-model.service';
import {UiComponent} from './learned-digits/ui/ui.component';

@NgModule({
  imports: [
    SharedModule,
    TensorflowExamplesRoutingModule
  ],
  providers: [DataGeneratorService, PolynominalRegretionService, DataDrawerService, MnistDataService, LearnedDigitsModelService],
  declarations: [PolynominalRegretionComponent, DataDrawerComponent, LearnedDigitsComponent, TensorflowExamplesComponent, UiComponent]
})
export class TensorflowExamplesModule {
}
