import {Injectable} from '@angular/core';
import {Point} from './point';

@Injectable()
export class TrainDataService {

  constructor() {
  }

  createTestData(amount): Point[] {
    const points = [];

    for (let i = 0; i < amount; i++) {
      points[i] = new Point();
    }

    return points;
  }

}
