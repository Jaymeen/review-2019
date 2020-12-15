import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionTemplateMappingComponent } from './session-template-mapping.component';

describe('SessionTemplateMappingComponent', () => {
  let component: SessionTemplateMappingComponent;
  let fixture: ComponentFixture<SessionTemplateMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionTemplateMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionTemplateMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
