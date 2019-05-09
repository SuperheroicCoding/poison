import {Injectable} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Data, NavigationEnd, Router} from '@angular/router';
import {filter, map, switchMap} from 'rxjs/operators';
import {AppRouteData} from '../app-routing.module';

@Injectable()
export class TitleService {
  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private titleService: Title) {
    const linkText$ = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      switchMap<NavigationEnd, any>((ignored) => {
        let actRoute = this.activatedRoute;
        while (actRoute.firstChild != null && actRoute.firstChild.outlet === 'primary') {
          actRoute = actRoute.firstChild;
        }
        return actRoute.data;
      }),
      map((data: AppRouteData) => `${data.linkText ? data.linkText + '@' : ''}Angular Examples by SuperheroicConding`)
    );

    linkText$.subscribe((titleText) =>
      this.titleService.setTitle(titleText)
    );
  }

}
