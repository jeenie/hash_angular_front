import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsdWithdrawComponent } from './usd-withdraw.component';

describe('UsdWithdrawComponent', () => {
  let component: UsdWithdrawComponent;
  let fixture: ComponentFixture<UsdWithdrawComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsdWithdrawComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsdWithdrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
