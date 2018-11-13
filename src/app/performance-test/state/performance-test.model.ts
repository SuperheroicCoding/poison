import {guid, ID} from '@datorama/akita';

let id = 0;

export interface PerformanceTest {
  id: ID;
  name: string;
  result: number;
}

/**
 * A factory function that creates PerformanceTest
 */
export function createPerformanceTest(params: Partial<PerformanceTest>) {
  return {
    id: id++,
    ...params
  } as PerformanceTest;
}
