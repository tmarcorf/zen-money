import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PaymentMethodModel } from '../../responses/payment-method/payment-method.model';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { PaymentMethodService } from '../../services/payment-method.service';

@Component({
  selector: 'app-select-payment-method',
  standalone: false,
  templateUrl: './select-payment-method.component.html',
  styleUrl: './select-payment-method.component.scss'
})
export class SelectPaymentMethodComponent implements OnInit {
  @Output() selectedPaymentMethod = new EventEmitter<PaymentMethodModel | null>();

  filteredPaymentMethods: PaymentMethodModel[] = [];
  paymentMethodFormControl = new FormControl<PaymentMethodModel | null>(null);

  constructor(private paymentMethodService: PaymentMethodService) {}

  ngOnInit(): void {
    this.paymentMethodFormControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(value => {
          const description = typeof value === 'string' ? value : value?.description ?? '';

          if (description == '') {
            this.selectedPaymentMethod.emit(null);
          }

          return this.paymentMethodService.listByDescription(description);
        })
      )
      .subscribe(response => {
        this.filteredPaymentMethods = response.data;
    });
  }

  onPaymentMethodClick() {
    if (this.paymentMethodFormControl.value) {
      return;
    }

    this.paymentMethodService.listByDescription('').subscribe(response => {
      this.filteredPaymentMethods = response.data;
    });
  }

  displayPaymentMethod(paymentMethod: PaymentMethodModel | string | null): string {
    return typeof paymentMethod === 'string'
      ? paymentMethod
      : paymentMethod?.description ?? '';
  }

  onPaymentMethodSelected(event: any) {
    this.selectedPaymentMethod.emit(event.option.value as PaymentMethodModel);
  }
}
