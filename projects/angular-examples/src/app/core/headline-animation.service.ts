import {Injectable} from '@angular/core';
import {BehaviorSubject, combineLatest, Observable} from 'rxjs';
import {distinctUntilChanged, map, tap} from 'rxjs/operators';

@Injectable()
export class HeadlineAnimationService {

  private _runAnimation$ = new BehaviorSubject<boolean>(true);
  readonly runAnimation$: Observable<boolean>;

  constructor() {
    const isVisible$ = new Observable<boolean>(subscriber => {

      const intersectionCallback: IntersectionObserverCallback = (entries: IntersectionObserverEntry[]) => {
        entries.forEach(entry => {
          subscriber.next(entry.isIntersecting);
        });
      };
      const observer = new IntersectionObserver(intersectionCallback);

      observer.observe(document.getElementById('main-toolbar'));
      return () => {
        observer.disconnect();
      };
    });

    this.runAnimation$ = combineLatest([
      this._runAnimation$.asObservable(),
      isVisible$]).pipe(
      map(([animate, isVisible]) => animate && isVisible),
      distinctUntilChanged(),
    );
  }

  stopAnimation() {
    this._runAnimation$.next(false);
  }

  startAnimation() {
    this._runAnimation$.next(true);
  }

  runWithoutAnimations<T>(runnable: () => T): T {
    this.stopAnimation();
    const result = runnable();
    this.startAnimation();
    return result;
  }


}
