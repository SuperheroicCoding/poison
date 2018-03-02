import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {SomeGpuCalculationComponent} from './some-gpu-calculation.component';
import {ReactiveFormsModule} from '@angular/forms';
import {GpuJsService} from './gpujs.service';
import {SomeGpuCalculationRoutingModule} from './some-gpu-calculation-routing.module';


@NgModule({
  imports: [
    SomeGpuCalculationRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ],
  declarations: [SomeGpuCalculationComponent],
  providers: [GpuJsService]
})
export class SomeGpuCalculationModule {
}
