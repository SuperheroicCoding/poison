import {ModuleWithProviders} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FourierAnalysisComponent} from './fourier-analysis/fourier-analysis.component';

const routes: Routes = [
  {path: '', component: FourierAnalysisComponent},
];

export const fourierAnalysisRoutingModule: ModuleWithProviders = RouterModule.forChild(routes);

