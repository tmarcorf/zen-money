import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpensesByPaymentMethodDashboardComponent } from './expenses-by-payment-method-dashboard.component';

describe('ExpensesByPaymentMethodDashboardComponent', () => {
  let component: ExpensesByPaymentMethodDashboardComponent;
  let fixture: ComponentFixture<ExpensesByPaymentMethodDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExpensesByPaymentMethodDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpensesByPaymentMethodDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
