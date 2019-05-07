import { TestBed } from '@angular/core/testing';

import { ScThanosService } from './sc-thanos.service';

describe('ScThanosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ScThanosService = TestBed.get(ScThanosService);
    expect(service).toBeTruthy();
  });
});
