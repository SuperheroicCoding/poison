import {ModuleWithProviders, NgModule} from '@angular/core';
import {ScThanosDirective} from './sc-thanos.directive';
import {createScThanosConfig, SC_THANOS_OPTIONS_TOKEN, ScThanosOptions} from './sc-thanos.options';
import {ScThanosService} from './sc-thanos.service';

@NgModule({
  declarations: [ScThanosDirective],
  imports: [],
  exports: [ScThanosDirective]
})
export class ScThanosModule {
  static forRoot(options?: Partial<ScThanosOptions>): ModuleWithProviders<ScThanosModule> {
    return {
      ngModule: ScThanosModule,
      providers: [
        ScThanosService,
        {provide: SC_THANOS_OPTIONS_TOKEN, useValue: createScThanosConfig(options)},
      ]
    };
  }
}
