export declare function logRecCalls(v: i32): void;

let recCalls: i32 = 0;

function fibRec(n: i32): i32 {
  if (n < 2) {
    return n;
  }
  recCalls++;
  return fibRec(n - 1) + fibRec(n - 2);
}

export function fib(n: i32): i32 {
  recCalls = 0;
  let result: i32 = fibRec(n);
  logRecCalls(recCalls);
  return result;
}

let memoize: Array<i32> = new Array<i32>(50);

export function fibMem(n: i32): i32 {
  recCalls = 0;

  let i: i32 = 0;
  while (i < 50) {
    memoize[i] = -1;
    i++;
  }

  let result: i32 = fibRecMem(n);
  logRecCalls(recCalls);
  return result;
}

function fibRecMem(n: i32): i32 {
  if (memoize[n] > -1) {
    return memoize[n];
  }
  if (n < 2) {
    return n;
  }
  recCalls++;
  let result: i32 = fibRecMem(n - 1) + fibRecMem(n - 2);
  memoize[n] = result;
  return result;
}





