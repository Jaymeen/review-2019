import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetTextComponent } from './get-text.component';

describe('GetTextComponent', () => {
  let component: GetTextComponent;
  let fixture: ComponentFixture<GetTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
