import {NgModule} from '@angular/core';
import {ShaderExamplesComponent} from './shader-examples.component';

import {ShaderExamplesRoutingModule} from './shader-examples-routing.module';
import {SharedModule} from '../shared/shared.module';
import { RenderShaderComponent } from './render-shader/render-shader.component';

@NgModule({
  imports: [
    SharedModule,
    ShaderExamplesRoutingModule
  ],
  declarations: [ShaderExamplesComponent, RenderShaderComponent]
})
export class ShaderExamplesModule {
}
