import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicStyleInputComponent } from './dynamic-style-input.component';

describe('DynamicStyleInputComponent', () => {
  let component: DynamicStyleInputComponent;
  let fixture: ComponentFixture<DynamicStyleInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DynamicStyleInputComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DynamicStyleInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
