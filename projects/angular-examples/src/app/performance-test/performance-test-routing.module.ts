import {ModuleWithProviders, NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PerformanceTestComponent} from './performance-test.component';

const routes: Routes = [
  {path: '', component: PerformanceTestComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PerformanceTestRoutingModule {
}
