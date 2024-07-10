import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { paymentDetailsResolver } from './payment-details.resolver';

describe('paymentDetailsResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => paymentDetailsResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
