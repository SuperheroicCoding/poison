import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { InputWaveStore, InputWaveState } from './input-wave.store';
import { InputWave } from './input-wave.model';

@Injectable({
  providedIn: 'root'
})
export class InputWaveQuery extends QueryEntity<InputWaveState, InputWave> {

  constructor(protected store: InputWaveStore) {
    super(store);
  }

}
