import {ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';
import {TitleService} from './title.service';
import {RandomService} from './random.service';

@NgModule({})
export class CoreModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [
        TitleService,
        RandomService,
      ],
    };
  }

  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
