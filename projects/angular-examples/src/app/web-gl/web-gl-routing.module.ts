import {ModuleWithProviders} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {WebGlComponent} from './web-gl.component';

const routes: Routes = [
  {path: '', component: WebGlComponent},
];

export const webGlRoutes: ModuleWithProviders = RouterModule.forChild(routes);

