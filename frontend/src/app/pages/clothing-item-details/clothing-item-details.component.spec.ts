import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClothingItemDetailsComponent } from './clothing-item-details.component';

describe('ClothingItemDetailsComponent', () => {
  let component: ClothingItemDetailsComponent;
  let fixture: ComponentFixture<ClothingItemDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClothingItemDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClothingItemDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
