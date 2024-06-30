import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicStyleOptionComponent } from './dynamic-style-option.component';

describe('DynamicStyleOptionComponent', () => {
  let component: DynamicStyleOptionComponent;
  let fixture: ComponentFixture<DynamicStyleOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DynamicStyleOptionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DynamicStyleOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
