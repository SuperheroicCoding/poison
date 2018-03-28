import {Component, Inject, OnInit} from '@angular/core';
import {AppRoute} from '../../app-routing.module';
import {ROUTER_LINKS} from '../../app-routes.token';
import {Router} from '@angular/router';
import {shader} from '../../title-shader';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.less']
})
export class AboutComponent implements OnInit {

  public routerLinks: AppRoute[];


  constructor(@Inject(ROUTER_LINKS) _routerLinks: AppRoute[], private router: Router) {
    this.routerLinks = _routerLinks.filter(route => route.data.linkText !== 'Home')
  }

  ngOnInit() {
  }

  openPage(route: AppRoute) {
    this.router.navigateByUrl(route.path);
  }


}
