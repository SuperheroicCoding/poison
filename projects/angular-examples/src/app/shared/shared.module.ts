import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';
import {MatDialogModule} from '@angular/material/dialog';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSliderModule} from '@angular/material/slider';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {Angulartics2Module} from 'angulartics2';
import {ScThanosModule} from '../../../../sc-thanos/src/lib/sc-thanos.module';
import {ElemResizedDirective} from './elem-resized.directive';
import {RaiseCardDirective} from './raise-card.directive';
import {RenderShaderComponent} from './render-shader/render-shader.component';
import {SafeHtmlPipe} from './safe-html.pipe';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    RaiseCardDirective,
    SafeHtmlPipe,
    RenderShaderComponent,
    ElemResizedDirective],
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
    RenderShaderComponent,
    Angulartics2Module,
    ScThanosModule,
    ElemResizedDirective
  ],

})
export class SharedModule {
}
