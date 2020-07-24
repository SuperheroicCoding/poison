import {NgModule} from '@angular/core';
import {WebGlComponent} from './web-gl.component';
import {WebGlRoutes} from './web-gl-routing.module';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    WebGlRoutes
  ],
  declarations: [WebGlComponent]
})
export class WebGlModule {
}
