import {ID} from '@datorama/akita';
import {InputWaveOptionsState} from './input-wave-options.store';

export interface InputWave {
  frequencies: number[];
  id: ID;
  points: number[];
  samples: number;
  lengthInMs: number;
}

let id = 0;

/**
 * A factory function that creates InputWave
 */
export function createInputWave(params: Partial<InputWave>) {
  return {
    id: id++,
    points: [],
    ...params
  } as InputWave;
}

export function createFrequencyPoints(frequencies: number[] = [440],                      // 220 Hz = "A" note
                                      lengthMs: number = 10, samples: number = 3000): Array<number> {
  function* gen(): IterableIterator<number> {
    let step = 0;
    while (step < samples) {
      const t = step * (lengthMs / samples) / 1000;
      yield  frequencies.reduce(
        (previousFreq, currentFreq) => previousFreq + Math.sin(currentFreq * 2 * Math.PI * t), 0) / frequencies.length;
      step++;
    }
  }

  return Array.from(gen());
}

export function createFrequencyWave({frequencies, samples, lengthInMs}: InputWaveOptionsState, points: number[]): InputWave {
  return createInputWave({points, frequencies, lengthInMs, samples: samples});
}
