import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {shader} from '../title-shader';
import {Observable} from 'rxjs';
import {HeadlineAnimationService} from '../core/headline-animation.service';
import {NavigationEnd, Router, RouterEvent} from '@angular/router';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'app-main-toolbar',
  templateUrl: './main-toolbar.component.html',
  styleUrls: ['./main-toolbar.component.scss']
})
export class MainToolbarComponent implements OnInit {

  @Output() clickSideNav = new EventEmitter<Event>();
  public shaderCode: string;
  runAnimation: Observable<boolean>;

  constructor(headlineAnimations: HeadlineAnimationService, private router: Router) {
    this.runAnimation = headlineAnimations.runAnimation;
    this.router.events.pipe(
      filter<RouterEvent>(value => value instanceof NavigationEnd
      )
    )
      .subscribe(() => {
        return headlineAnimations.startAnimation();
      });
    setTimeout(() => this.shaderCode = shader, 500);
  }

  ngOnInit() {
  }
}
