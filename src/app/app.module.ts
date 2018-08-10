import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {SharedModule} from './shared/shared.module';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {InfoComponent} from './info/info.component';
import {TechnologyComponent} from './info/technology/technology.component';
import {NavItemComponent} from './nav-item/nav-item.component';
import {CoreModule} from './core/core.module';
import {appRoutes, routes} from './app-routing.module';
import {AboutComponent} from './info/about/about.component';
import {ROUTER_LINKS} from './app-routes.token';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {ServiceWorkerUpdateComponent} from './service-worker-update/service-worker-update.component';
import {LoginModule} from './login/login.module';
import {AngularFireModule} from 'angularfire2';
import { MainToolbarComponent } from './main-toolbar/main-toolbar.component';
import {AngularFirestoreModule} from 'angularfire2/firestore';
import {AngularFireAuthModule} from 'angularfire2/auth';

@NgModule({
  declarations: [
    AppComponent,
    InfoComponent,
    TechnologyComponent,
    NavItemComponent,
    AboutComponent,
    ServiceWorkerUpdateComponent,
    MainToolbarComponent,
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    CoreModule.forRoot(),
    LoginModule,
    BrowserModule,
    appRoutes,
    BrowserAnimationsModule,
    SharedModule.forRoot(),
    ServiceWorkerModule.register('./ngsw-worker.js', {enabled: environment.production})
  ],
  providers: [
    {
      provide: ROUTER_LINKS, useValue: routes.filter(route => route.data ? route.data.linkText : false)
    }],
  bootstrap: [AppComponent]
})
export class AppModule {
}


