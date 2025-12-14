import { TestBed } from '@angular/core/testing';

import { RevenueService } from './RevenueService';

describe('Revenue', () => {
  let service: RevenueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RevenueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
