import {Injectable} from '@angular/core';
import {Query} from '@datorama/akita';
import {WasmTestStore, WasmTestState} from './wasm-test.store';

@Injectable({providedIn: 'root'})
export class WasmTestQuery extends Query<WasmTestState> {

  constructor(protected store: WasmTestStore) {
    super(store);
  }

  selectFibRunning() {
    return this.select((state) => state.fibRunning);
  }

  selectFibResult() {
    return this.select((state) => state.fibResult);
  }

  selectFibN() {
    return this.select((state) => state.fibOptions.fibN);
  }
}
