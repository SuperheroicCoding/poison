import {Injectable} from '@angular/core';
import {ID, mapInWorker} from '@datorama/akita';
import {of} from 'rxjs';
import {delay, map, switchMap, tap} from 'rxjs/operators';
import {InputWaveOptionsQuery} from './input-wave-options.query';
import {InputWaveOptionsState} from './input-wave-options.store';
import {createFrequencyWave, createFrequencyPoints, InputWave} from './input-wave.model';
import {InputWaveStore} from './input-wave.store';


@Injectable({providedIn: 'root'})
export class InputWaveService {

  constructor(private inputWaveStore: InputWaveStore, private inputWaveOptionsQuery: InputWaveOptionsQuery) {
    inputWaveOptionsQuery.select().pipe(
      tap(x => this.inputWaveStore.setLoading(true)),
      delay(1),
      map((options: InputWaveOptionsState) => {
        console.log('Update wave;');
        const points = createFrequencyPoints(options.frequencies, options.lengthInMs, options.samples);
        return createFrequencyWave(options, points);
      }))
      .subscribe((wave: InputWave) => {
        this.inputWaveStore.add(wave);
        this.inputWaveStore.setActive(wave.id);
        this.inputWaveStore.setLoading(false);
      });
  }

  add(inputWave: InputWave) {
    this.inputWaveStore.add(inputWave);
  }

  update(id, inputWave: Partial<InputWave>) {
    this.inputWaveStore.update(id, inputWave);
  }

  remove(id: ID) {
    this.inputWaveStore.remove(id);
  }
}
