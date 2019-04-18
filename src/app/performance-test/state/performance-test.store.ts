import {Injectable} from '@angular/core';
import {ActiveState, EntityState, EntityStore, getInitialEntitiesState, StoreConfig} from '@datorama/akita';
import {createPerformanceTest, PerformanceTest} from './performance-test.model';

export interface PerformanceTestState extends EntityState<PerformanceTest>, ActiveState {
}

const initInitialState = function (): EntityState<PerformanceTest, any> {
  const arrayReduce = createPerformanceTest({name: 'Array reduce'});
  const ngRxReduce = createPerformanceTest({name: 'ngrx range reduce'});
  const entities = {[arrayReduce.id]: arrayReduce, [ngRxReduce.id]: ngRxReduce};
  const state: EntityState<PerformanceTest, any> = getInitialEntitiesState();
  state.entities = entities;
  state.ids = Object.keys(entities);
  state.loading = false;
  return state;
};

@Injectable({providedIn: 'root'})
@StoreConfig({name: 'performance-test'})
export class PerformanceTestStore extends EntityStore<PerformanceTestState, PerformanceTest> {

  constructor() {
    super(initInitialState());
  }

}

