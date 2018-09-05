import {ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';
import {TitleService} from './title.service';
import {RandomService} from './random.service';
import {ServiceWorkerLogUpdateService} from './service-worker-log-update.service';
import {ServiceWorkerUpdateService} from './service-worker-update.service';
import {MatSnackBarModule} from '@angular/material';
import {HeadlineAnimationService} from './headline-animation.service';
import {GpuJsService} from './gpujs.service';
import {AngularFireModule} from 'angularfire2';
import {environment} from '../../environments/environment';
import {AngularFirestoreModule} from 'angularfire2/firestore';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {IsAuthenticatedGuard} from './guards/is-authenticated-guard.service';

@NgModule({
  imports: [MatSnackBarModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule]
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
        HeadlineAnimationService,
        GpuJsService,
        IsAuthenticatedGuard]
    };
  }

  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
