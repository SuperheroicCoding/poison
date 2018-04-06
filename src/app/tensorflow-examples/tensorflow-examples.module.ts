import {NgModule} from '@angular/core';
import {TensorflowExamplesRoutingModule} from './tensorflow-examples-routing.module';
import {TensorflowExamplesComponent} from './tensorflow-examples.component';
import {DataDrawerComponent} from './data-drawer/data-drawer.component';
import {DataGeneratorService} from './data-generator.service';
import {PolynominalRegretionService} from './polynominal-regretion.service';
import {DataDrawerService} from './data-drawer/data-drawer.service';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    TensorflowExamplesRoutingModule
  ],
  providers: [DataGeneratorService, PolynominalRegretionService, DataDrawerService],
  declarations: [TensorflowExamplesComponent, DataDrawerComponent]
})
export class TensorflowExamplesModule {
}
