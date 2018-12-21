import {Injectable} from '@angular/core';
import {filterNotNull} from '../../shared/operators/filter-not-null';
import {InputWaveOptionsStore, waveOptionsFromWave} from './input-wave-options.store';
import {InputWaveQuery} from './input-wave.query';

@Injectable({providedIn: 'root'})
export class InputWaveOptionsService {

  constructor(private inputWaveOptionsStore: InputWaveOptionsStore, inputWaveQuery: InputWaveQuery) {
    inputWaveQuery.selectActive()
      .pipe(filterNotNull)
      .subscribe(
        wave => this.inputWaveOptionsStore.update(waveOptionsFromWave(wave)));
  }

}
