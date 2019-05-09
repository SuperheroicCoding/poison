import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';



const minRadius = 1;

@Injectable()
export class PoissonConfigService {

  public k$: BehaviorSubject<number> = new BehaviorSubject(15);
  public iterationsPerFrame$: BehaviorSubject<number> = new BehaviorSubject(10);

  public r$: BehaviorSubject<number> = new BehaviorSubject(5);
  public w = minRadius / Math.sqrt(2);

  constructor() {
  }
}
