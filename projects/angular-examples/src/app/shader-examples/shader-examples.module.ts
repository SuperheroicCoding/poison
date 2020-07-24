import {NgModule} from '@angular/core';
import {AngularFireStorageModule} from '@angular/fire/storage';
import { MatPaginatorModule } from '@angular/material/paginator';
import {AceEditorModule} from 'ngx-ace-editor-wrapper';
import {SharedModule} from '../shared/shared.module';
import {CodeEditorComponent} from './code-editor/code-editor.component';
import {ShaderExamplesOptionsComponent} from './shader-examples-options/shader-examples-options.component';
import {ShaderExamplesRoutingModule} from './shader-examples-routing.module';
import {ShaderExamplesComponent} from './shader-examples.component';

@NgModule({
  imports: [
    SharedModule,
    ShaderExamplesRoutingModule,
    AceEditorModule,
    MatPaginatorModule,
    AngularFireStorageModule
  ],
  declarations: [ShaderExamplesComponent, ShaderExamplesOptionsComponent, CodeEditorComponent],
})
export class ShaderExamplesModule {
}
