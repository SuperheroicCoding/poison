import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {performanceTestRoutingModule} from './performance-test-routing.module';
import {PerformanceTestComponent} from './performance-test.component';

@NgModule({
  imports: [SharedModule, performanceTestRoutingModule],
  declarations: [PerformanceTestComponent]
})
export class PerformanceTestModule {
}
