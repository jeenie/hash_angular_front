import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtcWithdrawComponent } from './btc-withdraw.component';

describe('BtcWithdrawComponent', () => {
  let component: BtcWithdrawComponent;
  let fixture: ComponentFixture<BtcWithdrawComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BtcWithdrawComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BtcWithdrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
