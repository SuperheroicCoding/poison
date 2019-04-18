import {Component, Inject} from '@angular/core';
import {Angulartics2GoogleTagManager} from 'angulartics2/gtm';
import {ROUTER_LINKS} from './app-routes.token';
import {AppRoute} from './app-routing.module';
import {TitleService} from './core/title.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  // we need title service to update page title.
  // the logUpdate service is used to log service worker changes.
  constructor(private titleService: TitleService,
              gtmManager: Angulartics2GoogleTagManager,
              @Inject(ROUTER_LINKS) public routerLinks: AppRoute[]) {
    gtmManager.startTracking();
  }
}

