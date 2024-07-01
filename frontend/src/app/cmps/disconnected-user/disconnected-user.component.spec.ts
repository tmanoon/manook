import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisconnectedUserComponent } from './disconnected-user.component';

describe('DisconnectedUserComponent', () => {
  let component: DisconnectedUserComponent;
  let fixture: ComponentFixture<DisconnectedUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DisconnectedUserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DisconnectedUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
