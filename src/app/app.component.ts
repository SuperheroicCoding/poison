import {Component, Inject} from '@angular/core';
import {AppRoute} from './app-routing.module';
import {TitleService} from './core/title.service';
import {ROUTER_LINKS} from './app-routes.token';
import {shader} from './title-shader';
import {Observable} from 'rxjs/Observable';
import {HeadlineAnimationService} from './core/headline-animation.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  public shaderCode = shader;
  runAnimation: Observable<boolean>;

  // we need title service to update page title.
  // the logUpdate service is used to log service worker changes.
  constructor(private titleService: TitleService,
              @Inject(ROUTER_LINKS) public routerLinks: AppRoute[], headlineAnimations: HeadlineAnimationService) {
    this.runAnimation = headlineAnimations.runAnimation;
  }
}

