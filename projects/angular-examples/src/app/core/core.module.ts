import {ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';
import {AngularFireModule} from '@angular/fire';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import { MatSnackBarModule } from "@angular/material/snack-bar";
import {ServiceWorkerModule} from '@angular/service-worker';
import {Angulartics2Module} from 'angulartics2';
import {environment} from '../../environments/environment';
import {AuthenticationService} from './authentication.service';
import {GpuJsService} from './gpujs.service';
import {IsAuthenticatedGuard} from './guards/is-authenticated-guard.service';
import {HeadlineAnimationService} from './headline-animation.service';
import {RandomService} from './random.service';
import {ServiceWorkerLogUpdateService} from './service-worker-log-update.service';
import {ServiceWorkerUpdateService} from './service-worker-update.service';
import {TitleService} from './title.service';

@NgModule({
  imports: [
    MatSnackBarModule,
    AngularFireModule.initializeApp(environment.firebase),
    Angulartics2Module.forRoot(),
    AngularFirestoreModule,
    AngularFireAuthModule,
    ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production})]
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
        AuthenticationService,
        HeadlineAnimationService,
        GpuJsService,
        IsAuthenticatedGuard
      ]
    };
  }

  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
