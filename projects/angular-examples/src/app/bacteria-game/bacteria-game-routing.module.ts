import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BacteriaGameComponent} from './bacteria-game.component';

const routes: Routes = [
  {path: '', component: BacteriaGameComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BacteriaGameRoutingModule {
}
