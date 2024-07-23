import { TestBed } from '@angular/core/testing';

import { AirtableService } from './airtable.service';

describe('AirtableService', () => {
  let service: AirtableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AirtableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
