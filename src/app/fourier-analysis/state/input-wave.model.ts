import {ID} from '@datorama/akita';
import {InputWaveOptionsState} from './input-wave-options.store';

export interface InputWave {
  frequencies: number[];
  id: ID;
  points: number[];
  samplesPerSec: number;
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

export function createFrequencyPoints(frequencies: number[] = [220],                      // 220 Hz = "A" note
                                      lengthMs: number = 1000, samplesPerSec: number = 3000): Array<number> {
  function* gen(): IterableIterator<number> {
    let step = 0;
    const samples = Math.floor(samplesPerSec * lengthMs / 1000);
    while (step < samples) {
      const t = step / samplesPerSec;
      yield  frequencies.reduce(
        (previousFreq, currentFreq) => previousFreq + Math.sin(currentFreq * 2 * Math.PI * t), 0) / frequencies.length;
      step++;
    }
  }

  return Array.from(gen());
}

export function createFrequencyWave({frequencies, samplesPerSec, lengthInMs}: InputWaveOptionsState, points: number[]): InputWave {
  return createInputWave({points, frequencies, lengthInMs, samplesPerSec: samplesPerSec});
}
