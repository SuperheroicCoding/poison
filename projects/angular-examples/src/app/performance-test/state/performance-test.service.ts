import {Injectable} from '@angular/core';
import {ID, transaction} from '@datorama/akita';
import {animationFrameScheduler, defer, Observable, of, queueScheduler, range, Subject, timer} from 'rxjs';
import {map, reduce, switchMapTo, tap} from 'rxjs/operators';
import {createPerformanceTest, createPerformanceTestResult, PerformanceTest, PerformanceTestResults} from './performance-test.model';
import {PerformanceTestStore} from './performance-test.store';

export const arrayItems = 15000000;

const calcMeanTime = (previousValue: number, currentValue: PerformanceEntry, index: number, list: PerformanceEntryList): number =>
  previousValue + (1. / list.length) * currentValue.duration;


@Injectable({providedIn: 'root'})
export class PerformanceTestService {

  constructor(private performanceTestStore: PerformanceTestStore) {
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

  startTest(performanceTest: PerformanceTest): Observable<any> {
    this.performanceTestStore.setActive(performanceTest.id);
    let test$: Observable<PerformanceTestResults>;

    switch (performanceTest.id) {
      case 0:
        test$ = this.createArrayTest(performanceTest);
        break;
      case 1:
        test$ = this.createRxTest();
    }
    return timer(10, animationFrameScheduler).pipe(
      switchMapTo(test$),
      tap((result: PerformanceTestResults) => {
        this.update(performanceTest.id, {
          result,
          runs: performanceTest.runs + 1,
          ui: {...performanceTest.ui, progress: 100, duration: result[result.length - 1][1]}
        });
        this.performanceTestStore.setActive(null);
      }),
    );
  }

  private createArrayTest(performanceTest: PerformanceTest): Observable<PerformanceTestResults> {
    return defer(() => {
      performance.mark('startMark');
      const testArray: number[] = [];
      for (let i = 0; i < arrayItems; i++) {
        testArray.push(i);
      }
      performance.mark('arrayCreationEndMark');
      testArray.reduce((previousValue, currentValue) => previousValue + currentValue, 0);
      performance.mark('endMark');
      performance.measure('arrayCreation', 'startMark', 'arrayCreationEndMark');
      performance.measure('arrayReduceTest', 'startMark', 'endMark');
      performance.measure('arrayReduceTime', 'arrayCreationEndMark', 'endMark');

      const arrayCreation = this.calcMeanTime('arrayCreation');
      const completeTime = this.calcMeanTime('arrayReduceTest');
      const sumTime = this.calcMeanTime('arrayReduceTime');
      return of([
        createPerformanceTestResult('creation time', arrayCreation),
        createPerformanceTestResult('sum time', sumTime),
        createPerformanceTestResult('complete time', completeTime)]);
    });
  }

  private createRxTest(): Observable<PerformanceTestResults> {
    performance.mark('startMark');
    const performanceTest$ = range(0, arrayItems, queueScheduler).pipe(
      reduce((previousValue, currentValue) => previousValue + currentValue, 0),
      tap(() => {
        performance.mark('endMark');
        performance.measure('rxReduceTest', 'startMark', 'endMark');
      }),
      map(ignored => {
        const completeTime = this.calcMeanTime('rxReduceTest');
        return [createPerformanceTestResult('complete time', completeTime)];
      })
    );
    return performanceTest$;
  }

  private calcMeanTime(entriesName: string): number {
    return Math.round(performance.getEntriesByName(entriesName).reduce(calcMeanTime, 0) * 100) / 100;
  }

  private addToProgress(performanceTest: PerformanceTest, progressMs: number) {
    this.update(performanceTest.id, {
      ui: {
        ...performanceTest.ui,
        progress: Math.min((progressMs * 100 / performanceTest.ui.duration), 100)
      }
    });
  }
}
