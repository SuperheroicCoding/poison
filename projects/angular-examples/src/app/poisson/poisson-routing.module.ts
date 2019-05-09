import {ModuleWithProviders} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PoissonComponent} from './poisson.component';

const routes: Routes = [
  {path: '', component: PoissonComponent},
];

export const poissonRoutes: ModuleWithProviders = RouterModule.forChild(routes);

