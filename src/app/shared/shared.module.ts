import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RaiseCardDirective} from './raise-card.directive';
import 'hammerjs';

import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule
} from '@angular/material';
import {SafeHtmlPipe} from './safe-html.pipe';
import {AceEditorModule} from 'ng2-ace-editor';
import {CodeEditorComponent} from './code-editor/code-editor.component';
import {RenderShaderComponent} from './render-shader/render-shader.component';
import {FlexLayoutModule} from '@angular/flex-layout';

@NgModule({
  imports: [CommonModule, AceEditorModule],
  exports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    MatToolbarModule,
    MatTooltipModule,
    MatIconModule,
    MatCardModule,
    MatListModule,
    MatSelectModule,
    MatSidenavModule,
    MatGridListModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatSliderModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    RaiseCardDirective,
    SafeHtmlPipe,
    AceEditorModule,
    CodeEditorComponent,
    RenderShaderComponent,
    FlexLayoutModule
  ],
  declarations: [RaiseCardDirective, SafeHtmlPipe, CodeEditorComponent, RenderShaderComponent]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [],
    };
  }
}
