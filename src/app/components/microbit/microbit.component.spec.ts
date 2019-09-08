import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MicrobitComponent } from './microbit.component';

describe('MicrobitComponent', () => {
  let component: MicrobitComponent;
  let fixture: ComponentFixture<MicrobitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MicrobitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MicrobitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
