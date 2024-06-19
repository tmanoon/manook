import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClothingItemIndexComponent } from './clothing-item-index.component';

describe('ClothingItemIndexComponent', () => {
  let component: ClothingItemIndexComponent;
  let fixture: ComponentFixture<ClothingItemIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClothingItemIndexComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClothingItemIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
