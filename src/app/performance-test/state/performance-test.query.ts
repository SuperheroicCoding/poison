import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { PerformanceTestStore, PerformanceTestState } from './performance-test.store';
import { PerformanceTest } from './performance-test.model';

@Injectable({
  providedIn: 'root'
})
export class PerformanceTestQuery extends QueryEntity<PerformanceTestState, PerformanceTest> {

  constructor(protected store: PerformanceTestStore) {
    super(store);
  }

}
