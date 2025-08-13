import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdatePaymentMethodComponent } from './create-update-payment-method.component';

describe('CreateUpdatePaymentMethodComponent', () => {
  let component: CreateUpdatePaymentMethodComponent;
  let fixture: ComponentFixture<CreateUpdatePaymentMethodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateUpdatePaymentMethodComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateUpdatePaymentMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
