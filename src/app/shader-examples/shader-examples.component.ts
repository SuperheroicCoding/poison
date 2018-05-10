import {AfterContentInit, Component, ElementRef, ViewChild} from '@angular/core';
import {ShaderDef, shaders} from './shaders';
import {MatPaginator, PageEvent} from '@angular/material';
import {Subject, Observable, BehaviorSubject} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, map, mergeMapTo, share, tap} from 'rxjs/operators';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {animate, keyframes, transition, trigger} from '@angular/animations';
import {fadeInLeft, fadeInRight, fadeOutLeft, fadeOutRight} from './leftInOut.animation';

interface ShaderModel extends ShaderDef {
  fullSize: boolean;
}

@Component({
  selector: 'app-shader-examples',
  templateUrl: './shader-examples.component.html',
  styleUrls: ['./shader-examples.component.less'],
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
export class ShaderExamplesComponent implements AfterContentInit {
  shaders: ShaderModel[] = shaders.map((shader: ShaderDef) => Object.assign({fullSize: false}, shader)).reverse();
  showFps = false;
  showCodeEditor = false;
  shadersPaged$: Observable<ShaderModel[]>;
  currentPage$: Observable<PageEvent>;
  currentPageSubject: Subject<PageEvent> = new BehaviorSubject({
    length: this.shaders.length,
    pageIndex: 0,
    pageSize: 2
  });
  @ViewChild('shaderRenderer') shaderRenderer: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  isSmallScreen = false;
  pageEvent: PageEvent = {pageSize: 2, pageIndex: 0, length: this.shaders.length};
  animationState: string;
  private animationEnded$: BehaviorSubject<boolean>;

  constructor(private breakpointObserver: BreakpointObserver) {
  }

  ngAfterContentInit() {
    this.currentPage$ = this.currentPageSubject.asObservable().pipe(
      distinctUntilChanged((p1, p2) => p1.pageIndex === p2.pageIndex && p1.pageSize === p2.pageSize),
      tap(pageEvent => this.pageEvent = pageEvent),
      debounceTime<PageEvent>(400),
      share()
    );

    this.animationEnded$ = new BehaviorSubject<boolean>(true);

    this.shadersPaged$ = this.currentPage$
      .pipe(
        debounceTime<PageEvent>(400),
        mergeMapTo(this.animationEnded$),
        filter(animationEnded => animationEnded),
        map((ignored => {
          const event = this.pageEvent;
          return this.shaders.slice(event.pageSize * event.pageIndex, event.pageSize * event.pageIndex + event.pageSize);
        })),
        share()
      );

    this.breakpointObserver.observe(
      [Breakpoints.HandsetLandscape,
        Breakpoints.HandsetPortrait]).subscribe(
      result => {
        if (this.isSmallScreen !== result.matches && result.matches) {
          let oneShaderPerPageEvent = Object.assign({}, this.pageEvent, {pageSize: 1});
          this.changeCurrentShaderPage(oneShaderPerPageEvent);
        }
        this.isSmallScreen = result.matches;
      }
    );

    if (!this.pageEvent) {
      const currentPage = {length: this.shaders.length, pageIndex: 0, pageSize: 2};
      this.changeCurrentShaderPage(currentPage);
    }


  }

  changeCurrentShaderPage($event: PageEvent) {
    this.currentPageSubject.next($event);
  }

  get rendererHeight() {
    if (this.shaderRenderer && this.shaderRenderer.nativeElement) {
      return this.shaderRenderer.nativeElement.clientHeight;
    }
    return 0;
  }

  get rendererWidth() {
    if (this.shaderRenderer && this.shaderRenderer.nativeElement) {
      return this.shaderRenderer.nativeElement.clientWidth;
    }
    return 0;
  }

  trackByIndex(index, elem) {
    return index;
  }

  previousPage() {
    if (this.paginator.hasPreviousPage()) {
      this.paginator.previousPage()
    } else {
      this.paginator.lastPage();
    }
    this.startAnimation('fadeOutRight');
  }

  nextPage() {
    if (this.paginator.hasNextPage()) {
      this.paginator.nextPage()
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

}
