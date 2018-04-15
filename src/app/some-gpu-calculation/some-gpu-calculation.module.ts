import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {SomeGpuCalculationComponent} from './some-gpu-calculation.component';
import {ReactiveFormsModule} from '@angular/forms';
import {SomeGpuCalculationRoutingModule} from './some-gpu-calculation-routing.module';


@NgModule({
  imports: [
    SomeGpuCalculationRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ],
  declarations: [SomeGpuCalculationComponent]
})
export class SomeGpuCalculationModule {
}
