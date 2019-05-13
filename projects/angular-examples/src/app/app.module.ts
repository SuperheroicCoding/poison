import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AkitaNgDevtools} from '@datorama/akita-ngdevtools';
import {ScThanosModule} from 'sc-thanos';
import {environment} from '../environments/environment';
import {ROUTER_LINKS} from './app-routes.token';
import {appRoutes, routes} from './app-routing.module';

import {AppComponent} from './app.component';
import {CoreModule} from './core/core.module';
import {AboutComponent} from './info/about/about.component';
import {InfoComponent} from './info/info.component';
import {TechnologyComponent} from './info/technology/technology.component';
import {LoginModule} from './login/login.module';
import {MainToolbarComponent} from './main-toolbar/main-toolbar.component';
import {NavItemComponent} from './nav-item/nav-item.component';
import {ServiceWorkerUpdateComponent} from './service-worker-update/service-worker-update.component';
import {SharedModule} from './shared/shared.module';

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
    environment.production ? [] : AkitaNgDevtools.forRoot(),
    BrowserModule,
    CoreModule.forRoot(),
    ScThanosModule.forRoot({maxParticleCount: 200000, animationLength: 4000}),
    HttpClientModule,
    LoginModule,
    appRoutes,
    BrowserAnimationsModule,
    SharedModule,

  ],
  providers: [
    {
      provide: ROUTER_LINKS, useValue: routes.filter(route => route.data ? route.data.linkText : false)
    }],
  bootstrap: [AppComponent]
})
export class AppModule {
}


