import {Component, Inject} from '@angular/core';
import {AppRoute} from './app-routing.module';
import {TitleService} from './core/title.service';
import {ROUTER_LINKS} from './app-routes.token';
import {shader} from './title-shader';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  public shaderCode = shader;

  // we need title service to update page title.
  // the logUpdate service is used to log service worker changes.
  constructor(private titleService: TitleService,
              @Inject(ROUTER_LINKS) public routerLinks: AppRoute[]) {
  }
}

