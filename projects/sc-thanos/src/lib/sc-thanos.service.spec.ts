import {TestBed} from '@angular/core/testing';
import {ScThanosService} from './sc-thanos.service';

describe('ScThanosService', () => {
  beforeEach(() => TestBed.configureTestingModule({providers: [ScThanosService]}));

  it('should be created', () => {
    const service: ScThanosService = TestBed.inject(ScThanosService);
    expect(service).toBeTruthy();
  });
});
