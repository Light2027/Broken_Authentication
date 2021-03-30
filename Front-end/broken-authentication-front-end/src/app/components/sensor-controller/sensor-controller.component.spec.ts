import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorControllerComponent } from './sensor-controller.component';

describe('SensorControllerComponent', () => {
  let component: SensorControllerComponent;
  let fixture: ComponentFixture<SensorControllerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SensorControllerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SensorControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
