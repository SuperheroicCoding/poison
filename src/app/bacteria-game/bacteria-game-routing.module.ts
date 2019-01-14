import {ModuleWithProviders} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BacteriaGameComponent} from './bacteria-game.component';

const routes: Routes = [
  {path: '', component: BacteriaGameComponent},
];

export const bacteriaGameRoutingModule: ModuleWithProviders = RouterModule.forChild(routes);

