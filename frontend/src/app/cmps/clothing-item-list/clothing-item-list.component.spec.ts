import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClothingItemListComponent } from './clothing-item-list.component';

describe('ClothingItemListComponent', () => {
  let component: ClothingItemListComponent;
  let fixture: ComponentFixture<ClothingItemListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClothingItemListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClothingItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
