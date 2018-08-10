import {NgModule} from '@angular/core';
import {ShaderExamplesComponent} from './shader-examples.component';

import {ShaderExamplesRoutingModule} from './shader-examples-routing.module';
import {SharedModule} from '../shared/shared.module';
import {MatPaginatorModule} from '@angular/material';
import {ShaderCodeService} from './shader-code.service';
import {AngularFireStorageModule} from 'angularfire2/storage';

@NgModule({
  imports: [
    SharedModule,
    ShaderExamplesRoutingModule,
    MatPaginatorModule,
    AngularFireStorageModule
  ],
  declarations: [ShaderExamplesComponent],
  providers: [ShaderCodeService]
})
export class ShaderExamplesModule {
}
