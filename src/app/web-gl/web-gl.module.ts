import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WebGlComponent} from './web-gl.component';
import {webGlRoutes} from './web-gl-routing.module';

@NgModule({
  imports: [
    CommonModule,
    webGlRoutes
  ],
  declarations: [WebGlComponent]
})
export class WebGlModule {
}
