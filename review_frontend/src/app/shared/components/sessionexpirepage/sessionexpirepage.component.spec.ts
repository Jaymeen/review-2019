import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionexpirepageComponent } from './sessionexpirepage.component';

describe('SessionexpirepageComponent', () => {
  let component: SessionexpirepageComponent;
  let fixture: ComponentFixture<SessionexpirepageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionexpirepageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionexpirepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
