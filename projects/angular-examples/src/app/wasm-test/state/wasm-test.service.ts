import {Injectable} from '@angular/core';
import {delay, filter, switchMapTo, take, tap} from 'rxjs/operators';
import {WasmTestQuery} from './wasm-test.query';
import {WasmTestStore} from './wasm-test.store';

declare var WebAssembly;

function fibJS(n: number) {
  if (n < 2) {
    return n;
  }
  return fibJS(n - 1) + fibJS(n - 2);
}

const memoize = Array<number>(50);

function fibMemJS(nth: number) {
  memoize.fill(-1, 0, 50);
  return fibMemRec(nth);
}

function fibMemRec(n: number) {
  if (n < 2) {
    return n;
  }
  if (memoize[n] > -1) {
    return memoize[n];
  }

  const result = fibMemRec(n - 1) + fibMemRec(n - 2);
  memoize[n] = result;
  return result;
}


@Injectable({providedIn: 'root'})
export class WasmTestService {
  private fib: (number) => number;
  private fibMem: (number) => number;

  constructor(private wasmTestStore: WasmTestStore,
              private wasmTestQuery: WasmTestQuery) {
    this.instantiateWasm('assets/wasm/fib.wasm').then(result => {
      this.fib = result['fib'];
      this.fibMem = result['fibMem'];
      this.wasmTestStore.setLoading(false);
    });
  }

  private async instantiateWasm(url: string) {
    // fetch the wasm file
    const wasmFile = await fetch(url);

    // convert it into a binary array
    const buffer = await wasmFile.arrayBuffer();
    const results = await WebAssembly.instantiate(buffer,
      {env: {logRecCalls: (x: number) => console.log('wasm fibonacci recursive calls:', x)}}
    );
    return results.instance.exports;
  }

  startFibCalc() {
    this.wasmTestQuery.selectLoading().pipe(
      filter(loading => !loading),
      switchMapTo(this.wasmTestQuery.selectFibN()),
      take(1),
      tap(n => this.wasmTestStore.update({fibRunning: true})),
      delay(20),
      tap(n => {
        let startTime = window.performance.now();
        const wasmFib = this.fib(n);
        const fibWasmTime = window.performance.now() - startTime;

        startTime = window.performance.now();
        fibJS(n);
        const fibJSTime = window.performance.now() - startTime;

        this.wasmTestStore.update({
          fibRunning: false, fibResult: {fibOfN: wasmFib, fibWasmTime, fibJSTime, n}
        });
      })
    ).subscribe();
  }

  startFibMemCalc() {
    this.wasmTestQuery.selectLoading().pipe(
      filter(loading => !loading),
      switchMapTo(this.wasmTestQuery.selectFibN()),
      take(1),
      tap(n => this.wasmTestStore.update({fibRunning: true})),
      delay(20),
      tap(n => {
        let startTime = window.performance.now();
        const wasmFib = this.fibMem(n);
        const fibWasmTime = window.performance.now() - startTime;

        startTime = window.performance.now();
        fibMemJS(n);
        const fibJSTime = window.performance.now() - startTime;

        this.wasmTestStore.update({
          fibRunning: false, fibResult: {fibOfN: wasmFib, fibWasmTime, fibJSTime, n}
        });
      })
    ).subscribe();
  }
}


