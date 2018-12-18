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

@Injectable({providedIn: 'root'})
export class WasmTestService {
  private fib: (number) => number;

  constructor(private wasmTestStore: WasmTestStore,
              private wasmTestQuery: WasmTestQuery) {
    this.instantiateWasm('assets/wasm/fib.wasm', 'fib').then(result => {
      this.fib = result;
      this.wasmTestStore.setLoading(false);
    });
  }


  private async instantiateWasm(url: string, name: string) {
    // fetch the wasm file
    const wasmFile = await fetch(url);

    // convert it into a binary array
    const buffer = await wasmFile.arrayBuffer();

    const results = await WebAssembly.instantiate(buffer);
    return results.instance.exports[name];
  }

  startFibCalc() {
    this.wasmTestQuery.selectLoading().pipe(
      filter(loading => !loading),
      switchMapTo(this.wasmTestQuery.selectFibN()),
      take(1),
      tap(console.log),
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
}


