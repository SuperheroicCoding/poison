import {Injectable, NgZone} from '@angular/core';
import {ID, transaction} from '@datorama/akita';
import {defer, Observable, of, range} from 'rxjs';
import {map, reduce, tap} from 'rxjs/operators';
import {createPerformanceTest, PerformanceTest} from './performance-test.model';
import {PerformanceTestStore} from './performance-test.store';

@Injectable({providedIn: 'root'})
export class PerformanceTestService {

  constructor(private performanceTestStore: PerformanceTestStore, private ngZone: NgZone) {
  }

  @transaction()
  add(performanceTest: Partial<PerformanceTest>) {
    this.performanceTestStore.add(createPerformanceTest(performanceTest));
    this.performanceTestStore.setLoading(false);
  }

  update(id, performanceTest: Partial<PerformanceTest>) {
    this.performanceTestStore.update(id, performanceTest);
  }

  remove(id: ID) {
    this.performanceTestStore.remove(id);
  }

  startTest(performanceTest: PerformanceTest): Observable<number> {
    this.performanceTestStore.setActive(performanceTest.id);
    let test: Observable<number>;

    switch (performanceTest.id) {
      case 0:
        test = this.createArrayTest();
        break;
      case 1:
        test = this.createRxTest();
    }

    return test.pipe(tap(result => {
      this.update(performanceTest.id, {result});
      this.performanceTestStore.setActive(null);
    }));
  }

  private createArrayTest(): Observable<number> {
    return defer(() => {
      performance.mark('startMark');
      const testArray = [];
      for (let i = 0; i < 10000000; i++) {
        testArray.push(i);
      }
      testArray.reduce((previousValue, currentValue) => previousValue + currentValue, 0);
      performance.mark('endMark');
      performance.measure('arrayReduceTest', 'startMark', 'endMark');
      const result = performance.getEntriesByName('arrayReduceTest');
      return of(result[result.length - 1].duration);
    });
  }

  private createRxTest(): Observable<number> {
    performance.mark('startMark');
    return range(0, 10000000)
      .pipe(
        reduce((previousValue, currentValue) => previousValue + currentValue, 0),
        tap(() => {
          performance.mark('endMark');
          performance.measure('rxReduceTest', 'startMark', 'endMark');
        }),
        map(value => {
          const result = performance.getEntriesByName('rxReduceTest');
          return result[result.length - 1].duration;
        })
      );
  }
}
