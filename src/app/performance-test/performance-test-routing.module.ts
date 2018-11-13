import {ModuleWithProviders} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PerformanceTestComponent} from './performance-test.component';

const routes: Routes = [
  {path: '', component: PerformanceTestComponent},
];

export const performanceTestRoutingModule: ModuleWithProviders = RouterModule.forChild(routes);

