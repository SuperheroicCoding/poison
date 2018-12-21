import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface FourierAnalysisState {
   key: string;
}

export function createInitialState(): FourierAnalysisState {
  return {
    key: ''
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'fourier-analysis'})
export class FourierAnalysisStore extends Store<FourierAnalysisState> {

  constructor() {
    super(createInitialState());
  }

}

