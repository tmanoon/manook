import { TestBed } from '@angular/core/testing';

import { ClothingItemService } from './clothingitem.service';

describe('ClothingitemService', () => {
  let service: ClothingItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClothingItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
