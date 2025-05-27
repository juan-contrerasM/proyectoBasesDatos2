import { TestBed } from '@angular/core/testing';

import { PreguntaTempService } from './pregunta-temp.service';

describe('PreguntaTempService', () => {
  let service: PreguntaTempService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreguntaTempService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
