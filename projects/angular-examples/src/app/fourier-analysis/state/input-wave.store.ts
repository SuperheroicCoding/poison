import { Injectable } from '@angular/core';
import {ActiveState, EntityState, EntityStore, StoreConfig} from '@datorama/akita';
import { InputWave } from './input-wave.model';

export interface InputWaveState extends EntityState<InputWave>, ActiveState {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'input-wave' })
export class InputWaveStore extends EntityStore<InputWaveState, InputWave> {

  constructor() {
    super();
  }

}

