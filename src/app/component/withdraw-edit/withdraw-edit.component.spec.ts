import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawEditComponent } from './withdraw-edit.component';

describe('WithdrawEditComponent', () => {
  let component: WithdrawEditComponent;
  let fixture: ComponentFixture<WithdrawEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WithdrawEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WithdrawEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
