import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {NavigationEnd, Router, RouterEvent} from '@angular/router';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {Observable} from 'rxjs';
import {filter} from 'rxjs/operators';
import {HeadlineAnimationService} from '../core/headline-animation.service';
import {shader} from '../title-shader';

@Component({
  selector: 'app-main-toolbar',
  templateUrl: './main-toolbar.component.html',
  styleUrls: ['./main-toolbar.component.scss']
})
export class MainToolbarComponent implements OnInit, OnDestroy {

  @Output() clickSideNav = new EventEmitter<Event>();
  public shaderCode: string;
  runAnimation: Observable<boolean>;

  constructor(headlineAnimations: HeadlineAnimationService, private router: Router) {
    this.runAnimation = headlineAnimations.runAnimation;
    this.router.events.pipe(
      filter<RouterEvent>(value => value instanceof NavigationEnd
      ),
      untilDestroyed(this)
    )
      .subscribe(() => {
        return headlineAnimations.startAnimation();
      });
  }

  ngOnInit() {
    setTimeout(() => this.shaderCode = shader, 500);
  }

  ngOnDestroy(): void {
  }
}
