import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { InputWaveOptionsStore, InputWaveOptionsState } from './input-wave-options.store';

@Injectable({ providedIn: 'root' })
export class InputWaveOptionsQuery extends Query<InputWaveOptionsState> {

  constructor(protected store: InputWaveOptionsStore) {
    super(store);
  }

}
