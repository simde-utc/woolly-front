import { TestBed, inject } from '@angular/core/testing';

import { SaleService } from './sale.service';

describe('SaleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SaleService]
    });
  });

  it('should be created', inject([SaleService], (service: SaleService) => {
    expect(service).toBeTruthy();
  }));
});
