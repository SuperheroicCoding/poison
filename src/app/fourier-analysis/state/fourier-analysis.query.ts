import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import { FourierAnalysisStore, FourierAnalysisState } from './fourier-analysis.store';
import {InputWave} from './input-wave.model';
import {InputWaveQuery} from './input-wave.query';

@Injectable({ providedIn: 'root' })
export class FourierAnalysisQuery extends Query<FourierAnalysisState> {
  selectActiveWave: Observable<InputWave>;

  constructor(protected store: FourierAnalysisStore, private waveQuey: InputWaveQuery) {
    super(store);
    this.selectActiveWave = this.waveQuey.selectActive().pipe(tap(console.log));
  }




}
