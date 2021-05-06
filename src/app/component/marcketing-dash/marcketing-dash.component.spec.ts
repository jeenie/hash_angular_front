import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarcketingDashComponent } from './marcketing-dash.component';

describe('MarcketingDashComponent', () => {
  let component: MarcketingDashComponent;
  let fixture: ComponentFixture<MarcketingDashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarcketingDashComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarcketingDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
