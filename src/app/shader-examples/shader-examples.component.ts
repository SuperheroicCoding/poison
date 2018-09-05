import {AfterContentInit, Component, ElementRef, OnDestroy, ViewChild, ViewContainerRef} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material';
import {BehaviorSubject, ConnectableObservable, Observable, Subject, Subscription} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, map, mergeMapTo, publish, share, tap} from 'rxjs/operators';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {animate, keyframes, transition, trigger} from '@angular/animations';
import {fadeInLeft, fadeInRight, fadeOutLeft, fadeOutRight} from './leftInOut.animation';
import {ShaderCode, ShaderCodeQuery, ShaderCodeService, ShaderExamplesUIQuery} from './state';

@Component({
  selector: 'app-shader-examples',
  templateUrl: './shader-examples.component.html',
  styleUrls: ['./shader-examples.component.scss'],
  animations: [
    trigger('animator', [
      transition('void => *', animate(1000, keyframes(fadeInRight))),
      transition('* => fadeOutLeft', animate(200, keyframes(fadeOutLeft))),
      transition('* => fadeOutRight', animate(200, keyframes(fadeOutRight))),
      transition('fadeOutRight => *', animate(400, keyframes(fadeInLeft))),
      transition('fadeOutLeft => *', animate(400, keyframes(fadeInRight))),
    ])
  ]
})
export class ShaderExamplesComponent implements AfterContentInit, OnDestroy {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  shaders: ShaderCode[];
  showFps: Observable<boolean>;
  showCodeEditor: Observable<boolean>;
  isLoading: Observable<boolean>;
  shadersPaged$: Observable<ShaderCode[]>;
  currentPage$: Observable<PageEvent>;
  currentPageSubject: Subject<PageEvent> = new Subject();
  isSmallScreen = false;
  pageEvent: PageEvent;
  animationState: string;
  private animationEnded$: BehaviorSubject<boolean>;
  private shaders$: Observable<ShaderCode[]>;
  private subscription: Subscription;
  private isLoadingShaders: Observable<boolean>;

  constructor(private breakpointObserver: BreakpointObserver,
              private shaderCodeQuery: ShaderCodeQuery,
              shaderCodeService: ShaderCodeService,
              shaderExamplesQuery: ShaderExamplesUIQuery) {
    this.isLoading = shaderExamplesQuery.selectLoading();
    this.isLoadingShaders = this.shaderCodeQuery.selectLoading();
    this.showFps = shaderExamplesQuery.showFps;
    this.showCodeEditor = shaderExamplesQuery.showCodeEditor;
    this.shaders$ = this.shaderCodeQuery.selectAll();
    shaderCodeService.get();
  }

  ngAfterContentInit() {
    this.currentPage$ = this.currentPageSubject.asObservable().pipe(
      distinctUntilChanged((p1, p2) => p1.pageIndex === p2.pageIndex && p1.pageSize === p2.pageSize),
      tap(pageEvent => this.pageEvent = pageEvent),
      debounceTime<PageEvent>(400),
      publish()
    );
    this.subscription = this.subscription = (this.currentPage$ as ConnectableObservable<PageEvent>).connect();

    this.animationEnded$ = new BehaviorSubject<boolean>(true);

    this.shadersPaged$ = this.currentPage$
      .pipe(
        debounceTime<PageEvent>(400),
        mergeMapTo(this.animationEnded$),
        filter(animationEnded => animationEnded),
        map(ignored => {
          const event = this.pageEvent;
          return this.shaders.slice(event.pageSize * event.pageIndex, event.pageSize * event.pageIndex + event.pageSize);
        }),
        share()
      );

    this.breakpointObserver.observe(
      [Breakpoints.HandsetLandscape,
        Breakpoints.HandsetPortrait]).subscribe(
      result => {
        if (this.isSmallScreen !== result.matches && result.matches) {
          const oneShaderPerPageEvent = Object.assign({}, this.pageEvent, {pageSize: 1});
          this.changeCurrentShaderPage(oneShaderPerPageEvent);
        }
        this.isSmallScreen = result.matches;
      }
    );

    this.subscription.add(
      this.shaders$.pipe(
        filter(shaders => shaders && shaders.length > 0)
      ).subscribe(shaders => {
        this.shaders = shaders;
        this.pageEvent = {
          length: this.shaders.length,
          pageIndex: 0,
          pageSize: 2
        };
        this.currentPageSubject.next(this.pageEvent);
      }));
  }

  changeCurrentShaderPage($event: PageEvent) {
    this.currentPageSubject.next($event);
  }

  trackByIndex(index, elem) {
    return index;
  }

  previousPage() {
    if (this.paginator.hasPreviousPage()) {
      this.paginator.previousPage();
    } else {
      this.paginator.lastPage();
    }
    this.startAnimation('fadeOutRight');
  }

  nextPage() {
    if (this.paginator.hasNextPage()) {
      this.paginator.nextPage();
    } else {
      this.paginator.firstPage();
    }
    this.startAnimation('fadeOutLeft');
  }

  startAnimation(state) {
    if (!this.animationState) {
      this.animationEnded$.next(false);
      this.animationState = state;
    }
  }

  resetAnimationState() {
    this.animationState = '';
    this.animationEnded$.next(true);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
