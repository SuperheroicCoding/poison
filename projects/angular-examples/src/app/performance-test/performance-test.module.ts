import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {PerformanceTestRoutingModule} from './performance-test-routing.module';
import {PerformanceTestComponent} from './performance-test.component';

@NgModule({
  imports: [SharedModule, PerformanceTestRoutingModule],
  declarations: [PerformanceTestComponent]
})
export class PerformanceTestModule {
}
