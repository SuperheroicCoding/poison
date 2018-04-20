import {NgModule} from '@angular/core';
import {ShaderExamplesComponent} from './shader-examples.component';

import {ShaderExamplesRoutingModule} from './shader-examples-routing.module';
import {SharedModule} from '../shared/shared.module';
import {MatPaginatorModule} from '@angular/material';

@NgModule({
  imports: [
    SharedModule,
    ShaderExamplesRoutingModule,
    MatPaginatorModule
  ],
  declarations: [ShaderExamplesComponent]
})
export class ShaderExamplesModule {
}
