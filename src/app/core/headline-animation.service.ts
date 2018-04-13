import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class HeadlineAnimationService {

  private _runAnimation = new BehaviorSubject<boolean>(true);

  constructor() {
  }

  get runAnimation() {
    return this._runAnimation.asObservable();
  }

  stopAnimation() {
    this._runAnimation.next(false);
  }

  startAnimation() {
    this._runAnimation.next(true);
  }


}
