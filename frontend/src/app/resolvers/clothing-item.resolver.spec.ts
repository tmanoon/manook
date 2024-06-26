import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { clothingItemResolver } from './clothing-item.resolver';

describe('clothingItemResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => clothingItemResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
