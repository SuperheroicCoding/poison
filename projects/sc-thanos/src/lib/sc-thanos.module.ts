import {ModuleWithProviders, NgModule} from '@angular/core';
import * as _html2canvas from 'html2canvas';
import {HTML2CANVAS_INJECTION_TOKEN} from './html-2-canvas.token';
import {ScThanosDirective} from './sc-thanos.directive';
import {defaultScThanosConfig, SC_THANOS_OPTIONS_TOKEN, ScThanosOptions} from './sc-thanos.options';
import {ScThanosService} from './sc-thanos.service';

const html2canvas = _html2canvas;
console.log({html2canvas});

@NgModule({
  declarations: [ScThanosDirective],
  imports: [],
  exports: [ScThanosDirective]
})
export class ScThanosModule {
  static forRoot(config?: Partial<ScThanosOptions>): ModuleWithProviders {
    return {
      ngModule: ScThanosModule,
      providers: [
        ScThanosService,
        {provide: SC_THANOS_OPTIONS_TOKEN, useValue: {...defaultScThanosConfig, ...config}},
        {provide: HTML2CANVAS_INJECTION_TOKEN, useValue: html2canvas}
      ]
    };
  }
}
