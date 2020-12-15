import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetCheckboxComponent } from './get-checkbox.component';

describe('GetCheckboxComponent', () => {
  let component: GetCheckboxComponent;
  let fixture: ComponentFixture<GetCheckboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetCheckboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
