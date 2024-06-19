import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeClothingItemPreviewComponent } from './home-clothing-item-preview.component';

describe('HomeClothingItemPreviewComponent', () => {
  let component: HomeClothingItemPreviewComponent;
  let fixture: ComponentFixture<HomeClothingItemPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeClothingItemPreviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomeClothingItemPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
