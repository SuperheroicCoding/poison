import {Injectable} from '@angular/core';
import {applyTransaction, ID} from '@datorama/akita';
import {delay, map, tap} from 'rxjs/operators';
import {InputWaveOptionsQuery} from './input-wave-options.query';
import {InputWaveOptionsState} from './input-wave-options.store';
import {createFrequencyPoints, createFrequencyWave, InputWave} from './input-wave.model';
import {InputWaveQuery} from './input-wave.query';
import {InputWaveStore} from './input-wave.store';

const kAmplitute = 100;

function playByteArray(bytes: ArrayLike<number>, sampleRate: number, context: AudioContext) {
  const buffer = context.createBuffer(1, bytes.length, sampleRate);
  const buf = buffer.getChannelData(0);
  for (let i = 0; i < bytes.length; ++i) {
    buf[i] = bytes[i] * kAmplitute;
  }
  const node = context.createBufferSource();
  node.buffer = buffer;
  node.connect(context.destination);
  node.start();
}

@Injectable({providedIn: 'root'})
export class InputWaveService {

  constructor(private inputWaveStore: InputWaveStore, private inputWaveOptionsQuery: InputWaveOptionsQuery,
              private inputWaveQuery: InputWaveQuery) {
    inputWaveOptionsQuery.select().pipe(
      tap(x => this.inputWaveStore.setLoading(true)),
      delay(1),
      map((options: InputWaveOptionsState) => {
        const points = createFrequencyPoints(options.frequencies, options.lengthInMs, options.samplesPerSec);
        return createFrequencyWave(options, points);
      }))
      .subscribe((wave: InputWave) => {
        applyTransaction(() => {
          this.inputWaveStore.add(wave);
          this.inputWaveStore.setActive(wave.id);
          this.inputWaveStore.remove(entity => entity.id !== wave.id);
          this.inputWaveStore.setLoading(false);
        });
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

  listenToWave() {
    const activeWave = this.inputWaveQuery.getActive();
    if (activeWave != null) {
      const context = new AudioContext();
      playByteArray(activeWave.points, activeWave.samplesPerSec, context);
    }
  }


}
