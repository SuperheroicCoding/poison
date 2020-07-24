import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {WebGlComponent} from './web-gl.component';

const routes: Routes = [
  {path: '', component: WebGlComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebGlRoutes {
}
