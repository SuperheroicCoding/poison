import {Component, Inject} from '@angular/core';
import {AppRoute} from './app-routing.module';
import {TitleService} from './core/title.service';
import {ROUTER_LINKS} from './app-routes.token';
import {shader} from './title-shader';
import {Observable} from 'rxjs';
import {HeadlineAnimationService} from './core/headline-animation.service';
import {NavigationEnd, Router, RouterEvent} from '@angular/router';
import {filter, tap} from 'rxjs/operators';


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
              @Inject(ROUTER_LINKS) public routerLinks: AppRoute[], headlineAnimations: HeadlineAnimationService, private router: Router) {
    this.runAnimation = headlineAnimations.runAnimation;
    this.router.events.pipe(
      filter<RouterEvent>(value => value instanceof NavigationEnd
      )
    )
      .subscribe(() => {
        return headlineAnimations.startAnimation();
      })
  }
}

