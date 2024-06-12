import { TestBed } from '@angular/core/testing';

import { ClothingitemService } from './clothingitem.service';

describe('ClothingitemService', () => {
  let service: ClothingitemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClothingitemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
