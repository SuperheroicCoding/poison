import {ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';
import {TitleService} from './title.service';
import {RandomService} from './random.service';
import {ServiceWorkerLogUpdateService} from './service-worker-log-update.service';
import {ServiceWorkerUpdateService} from './service-worker-update.service';
import {MatSnackBarModule} from '@angular/material';
import {HeadlineAnimationService} from './headline-animation.service';

@NgModule({
  imports: [MatSnackBarModule]
})
export class CoreModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [
        TitleService,
        RandomService,
        ServiceWorkerLogUpdateService,
        ServiceWorkerUpdateService,
        HeadlineAnimationService
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
