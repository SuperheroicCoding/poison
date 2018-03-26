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


@NgModule({
  declarations: [
    AppComponent,
    InfoComponent,
    TechnologyComponent,
    NavItemComponent,
    AboutComponent,
  ],
  imports: [
    CoreModule.forRoot(),
    BrowserModule,
    appRoutes,
    BrowserAnimationsModule,
    SharedModule.forRoot()
  ],
  providers: [{
    provide: ROUTER_LINKS, useValue: routes.filter((route) => route.data ? route.data.linkText : false)
  }],
  bootstrap: [AppComponent]
})
export class AppModule {
}
