import {Injectable} from '@angular/core';
import loader from 'assemblyscript/lib/loader';
import {delay, filter, switchMapTo, take, tap} from 'rxjs/operators';
import {WasmTestQuery} from './wasm-test.query';
import {WasmTestStore} from './wasm-test.store';
import ASModule from '@fib-wasm';

function fibJS(n: number): any | number {
  if (n < 2) {
    return n;
  }
  return fibJS(n - 1) + fibJS(n - 2);
}

const memoize = Array<number>(50);

function fibMemJS(nth: number): any | number {
  memoize.fill(-1, 0, 50);
  return fibMemRec(nth);
}

function fibMemRec(n: number): any | number {
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
    this.instantiateWasm()
      .then(result => {
        this.fib = result.fib;
        this.fibMem = result.fibMem;
      })
      .catch(e => {
        console.error(e);
        this.wasmTestStore.setError('Error loading WASM module!');
      })
      .finally(() => this.wasmTestStore.setLoading(false));
  }

  private async instantiateWasm(): Promise<typeof ASModule> {
    const fibImports = {
      index: {
        logRecCalls(recCalls) {
          console.log('Reccalls: ', recCalls);
        }
      },
      env: {
        abort(_msg, _file, line, column) {
          console.error('abort called at index.ts:' + line + ':' + column);
        },
        memory: new WebAssembly.Memory({initial: 256}),
      }
    };
    return loader.instantiateStreaming(fetch('build/optimized.wasm'), fibImports) as unknown as Promise<typeof ASModule>;
  }

  startFibCalc(): void {
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
    ).subscribe({error: (error) => this.handleCalculationError(error)});
  }

  private handleCalculationError(error: any): void {
    console.error(error);
    this.wasmTestStore.setError('Error calculating Fibonacci number');
    this.wasmTestStore.setLoading(false);
  }

  startFibMemCalc(): void {
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
          fibRunning: false,
          fibResult: {
            n,
            fibOfN: wasmFib,
            fibWasmTime,
            fibJSTime,
          }
        });
      })
    ).subscribe({error: err => this.handleCalculationError(err)});
  }
}


