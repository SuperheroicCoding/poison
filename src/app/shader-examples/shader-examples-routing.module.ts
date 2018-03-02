import {ModuleWithProviders} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ShaderExamplesComponent} from './shader-examples.component';

const routes: Routes = [{path: '', component: ShaderExamplesComponent}];

export const ShaderExamplesRoutingModule: ModuleWithProviders = RouterModule.forChild(routes);
