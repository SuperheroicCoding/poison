import {ModuleWithProviders} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ShaderExamplesComponent} from './shader-examples.component';
import {IsAuthenticatedGuard} from '../core/guards/is-authenticated-guard.service';

const routes: Routes = [
  {
    path: '',
    component: ShaderExamplesComponent,
    canActivate: [IsAuthenticatedGuard]
  },
];

export const ShaderExamplesRoutingModule: ModuleWithProviders = RouterModule.forChild(routes);
