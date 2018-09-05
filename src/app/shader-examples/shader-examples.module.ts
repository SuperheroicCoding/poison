import {NgModule} from '@angular/core';
import {ShaderExamplesComponent} from './shader-examples.component';

import {ShaderExamplesRoutingModule} from './shader-examples-routing.module';
import {SharedModule} from '../shared/shared.module';
import {MatPaginatorModule} from '@angular/material';
import {AngularFireStorageModule} from 'angularfire2/storage';
import { ShaderExamplesOptionsComponent } from './shader-examples-options/shader-examples-options.component';

@NgModule({
  imports: [
    SharedModule,
    ShaderExamplesRoutingModule,
    MatPaginatorModule,
    AngularFireStorageModule
  ],
  declarations: [ShaderExamplesComponent, ShaderExamplesOptionsComponent],
})
export class ShaderExamplesModule {
}
