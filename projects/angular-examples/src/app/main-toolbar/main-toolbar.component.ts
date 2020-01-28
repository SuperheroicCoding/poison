import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {NavigationEnd, Router, RouterEvent} from '@angular/router';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {combineLatest, Observable} from 'rxjs';
import {distinctUntilChanged, filter, map, tap} from 'rxjs/operators';
import {HeadlineAnimationService} from '../core/headline-animation.service';
import {shader} from '../title-shader';

@Component({
  selector: 'app-main-toolbar',
  templateUrl: './main-toolbar.component.html',
  styleUrls: ['./main-toolbar.component.scss']
})
export class MainToolbarComponent implements OnInit, OnDestroy, AfterViewInit {

  @Output() clickSideNav = new EventEmitter<Event>();
  shaderCode: string;
  runAnimation$: Observable<boolean>;
  isHandset$: Observable<boolean>;

  constructor(
    private elRef: ElementRef,
    private headlineAnimations: HeadlineAnimationService,
    private router: Router,
    private breakpointObserver: BreakpointObserver) {
    this.router.events.pipe(
      filter<RouterEvent>(value => value instanceof NavigationEnd
      ),
      untilDestroyed(this)
    )
      .subscribe(() => headlineAnimations.startAnimation());
    this.isHandset$ = breakpointObserver.observe(Breakpoints.Handset).pipe(map(value => value.matches));
  }

  ngOnInit() {
    setTimeout(() => this.shaderCode = shader, 500);
  }

  ngAfterViewInit() {

    const isVisible$ = new Observable<boolean>(subscriber => {

      const intersectionCallback: IntersectionObserverCallback = (entries: IntersectionObserverEntry[]) => {
        entries.forEach(entry => {
          subscriber.next(entry.isIntersecting);
        });
      };
      const observer = new IntersectionObserver(intersectionCallback);

      observer.observe(this.elRef.nativeElement);
      return () => {
        observer.disconnect();
      };
    });

    this.runAnimation$ = combineLatest([
      this.headlineAnimations.runAnimation$,
      isVisible$]).pipe(
      map(([animate, isVisible]) => animate && isVisible),
      distinctUntilChanged(),
      tap(console.log)
    );
  }

  ngOnDestroy(): void {
  }
}
