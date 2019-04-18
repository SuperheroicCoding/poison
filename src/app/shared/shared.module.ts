import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Angulartics2Module} from 'angulartics2';
import {RaiseCardDirective} from './raise-card.directive';
import 'hammerjs';

import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule, MatDialogModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule, MatProgressBarModule,
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
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    MatToolbarModule,
    MatTooltipModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    MatListModule,
    MatSelectModule,
    MatSidenavModule,
    MatGridListModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatSliderModule,
    MatChipsModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    RaiseCardDirective,
    SafeHtmlPipe,
    AceEditorModule,
    CodeEditorComponent,
    RenderShaderComponent,
    FlexLayoutModule,
    Angulartics2Module
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
