import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ID} from '@datorama/akita';
import {Observable} from 'rxjs';
import {PerformanceTest} from './state/performance-test.model';
import {PerformanceTestQuery} from './state/performance-test.query';
import {arrayItems, PerformanceTestService} from './state/performance-test.service';

@Component({
  selector: 'app-performance-test',
  templateUrl: './performance-test.component.html',
  styleUrls: ['./performance-test.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PerformanceTestComponent implements OnInit {
  performanceTest$: Observable<PerformanceTest[]>;
  isLoading$: Observable<boolean>;
  activePerformanceTest$: Observable<PerformanceTest>;
  arrayItems: number = arrayItems;

  constructor(private performanceTestQuery: PerformanceTestQuery,
              private performanceTestService: PerformanceTestService
  ) {
  }

  ngOnInit() {
    this.performanceTest$ = this.performanceTestQuery.selectAll();
    this.isLoading$ = this.performanceTestQuery.selectLoading();
    this.activePerformanceTest$ = this.performanceTestQuery.selectActive();
  }

  add(performanceTest: Partial<PerformanceTest>) {
    this.performanceTestService.add(performanceTest);
  }

  update(id: ID, performanceTest: Partial<PerformanceTest>) {
    this.performanceTestService.update(id, performanceTest);
  }

  remove(id: ID) {
    this.performanceTestService.remove(id);
  }

  startTest(performanceTest: PerformanceTest) {
    this.performanceTestService.startTest(performanceTest).subscribe();
  }

  trackByPerformanceTestId(index: number, item: PerformanceTest) {
    return item.id;
  }
}
