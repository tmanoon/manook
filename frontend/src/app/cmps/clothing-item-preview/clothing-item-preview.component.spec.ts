import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClothingItemPreviewComponent } from './clothing-item-preview.component';

describe('ClothingItemPreviewComponent', () => {
  let component: ClothingItemPreviewComponent;
  let fixture: ComponentFixture<ClothingItemPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClothingItemPreviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClothingItemPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
