import {NgModule} from '@angular/core';
import {AngularFireStorageModule} from '@angular/fire/storage';
import {MatPaginatorModule} from '@angular/material';
import {SharedModule} from '../shared/shared.module';
import {ShaderExamplesOptionsComponent} from './shader-examples-options/shader-examples-options.component';
import {ShaderExamplesRoutingModule} from './shader-examples-routing.module';
import {ShaderExamplesComponent} from './shader-examples.component';

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
