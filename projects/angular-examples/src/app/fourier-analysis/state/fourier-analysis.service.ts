import {Injectable} from '@angular/core';
import {FourierAnalysisStore} from './fourier-analysis.store';

@Injectable({providedIn: 'root'})
export class FourierAnalysisService {

  constructor(private fourierAnalysisStore: FourierAnalysisStore,
  ) {


  }


}
