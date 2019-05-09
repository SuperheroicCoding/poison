import {NgModule} from '@angular/core';
import {WebGlComponent} from './web-gl.component';
import {webGlRoutes} from './web-gl-routing.module';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    webGlRoutes
  ],
  declarations: [WebGlComponent]
})
export class WebGlModule {
}
