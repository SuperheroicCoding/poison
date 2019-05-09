import {ID} from '@datorama/akita';

let id = 0;

export interface PerformanceTest {
  id: ID;
  name: string;
  result: PerformanceTestResults;
  runs: number;
  ui?: {progress: number, duration: number};
}

export interface PerformanceTestResults extends Array<[string, number]> {
}

export function createPerformanceTestResult(name: string, result: number): [string, number] {
  return [name, result];
}

/**
 * A factory function that creates PerformanceTest
 */
export function createPerformanceTest(params: Partial<PerformanceTest>) {
  return {
    id: id++,
    result: [createPerformanceTestResult('press start to measure', NaN)],
    runs: 0,
    ui: {progress: 0, duration: 100},
    ...params
  } as PerformanceTest;
}
