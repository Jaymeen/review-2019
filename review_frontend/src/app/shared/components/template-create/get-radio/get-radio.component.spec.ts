import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetRadioComponent } from './get-radio.component';

describe('GetRadioComponent', () => {
  let component: GetRadioComponent;
  let fixture: ComponentFixture<GetRadioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetRadioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetRadioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
