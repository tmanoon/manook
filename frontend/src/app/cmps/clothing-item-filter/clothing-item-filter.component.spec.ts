import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClothingItemFilterComponent } from './clothing-item-filter.component';

describe('ClothingItemFilterComponent', () => {
  let component: ClothingItemFilterComponent;
  let fixture: ComponentFixture<ClothingItemFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClothingItemFilterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClothingItemFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
