import {Injectable} from '@angular/core';
import {Store, StoreConfig} from '@datorama/akita';
import {InputWave} from './input-wave.model';

export interface InputWaveOptionsState {
  frequencies: number[];
  lengthInMs: number;
  samplesPerSec: number;
}

export function createInitialState(): InputWaveOptionsState {
  return {
    frequencies: [20],
    lengthInMs: 1000,
    samplesPerSec: 30000,
  };
}

export function waveOptionsFromWave(wave: InputWave): InputWaveOptionsState {
  return {frequencies: wave.frequencies, lengthInMs: wave.lengthInMs, samplesPerSec: wave.samplesPerSec};
}

@Injectable({providedIn: 'root'})
@StoreConfig({name: 'input-wave-options'})
export class InputWaveOptionsStore extends Store<InputWaveOptionsState> {

  constructor() {
    super(createInitialState());
  }

}

