import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ExpenseModel } from '../../../responses/expense/expense-model';
import { ExpenseTypeEnum } from '../../../enums/expense-type.enum';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { validDateValidator } from '../../../utils/date.formats';
import { formatDate } from '../../../utils/date.formats';
import { ExpenseService } from '../../../services/expense.service';
import { NotificationService } from '../../../services/notification.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import moment from 'moment';
import { CreateExpenseRequest } from '../../../requests/expense/create-expense.request';
import { UpdateExpenseRequest } from '../../../requests/expense/update-expense.request';
import { CategoryModel } from '../../../responses/category/category-model';
import { PaymentMethodModel } from '../../../responses/payment-method/payment-method.model';
import { CategoryService } from '../../../services/category.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { formatAmount, formatToBRL } from '../../../utils/currency.formats';
import { PaymentMethodService } from '../../../services/payment-method.service';

@Component({
  selector: 'app-create-update-expense',
  standalone: false,
  templateUrl: './create-update-expense.component.html',
  styleUrl: './create-update-expense.component.scss'
})
export class CreateUpdateExpenseComponent implements OnInit {
  isNewExpense: boolean = false;
  selectedExpense?: ExpenseModel;

  expenseTypes = Object.values(ExpenseTypeEnum);
  selectedType = ExpenseTypeEnum.Variable;
  selectedCategory?: CategoryModel;
  filteredCategories: CategoryModel[] = [];
  categoryFormControl = new FormControl<CategoryModel | null>(null, Validators.required);

  selectedPaymentMethod?: PaymentMethodModel;
  filteredPaymentMethods: PaymentMethodModel[] = [];
  paymentMethodFormControl = new FormControl<PaymentMethodModel | null>(null, Validators.required);

  form: FormGroup = new FormGroup({
    type: new FormControl('', Validators.required),
    description: new FormControl('', [
      Validators.required,
      Validators.maxLength(100)
    ]),
    date: new FormControl('', [
      Validators.required,
      validDateValidator()
    ]),
    amount: new FormControl('', [
      Validators.required,
    ]),
    isActive: new FormControl(''),
    searchCategory: new FormControl(''),
  });

  constructor(
    private expenseService: ExpenseService,
    private notificationService: NotificationService,
    private categoryService: CategoryService,
    private paymentMethodService: PaymentMethodService,
    public dialogRef: MatDialogRef<CreateUpdateExpenseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {row: ExpenseModel, isNewExpenseDialog: boolean}){
      this.selectedExpense = data.row;
      this.isNewExpense = data.isNewExpenseDialog;
    }

  ngOnInit(): void {
    this.categoryFormControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(value => {
          const name = typeof value === 'string' ? value : value?.name ?? '';
          return this.categoryService.listByName(name);
        })
      )
      .subscribe(response => {
        this.filteredCategories = response.data;
    });

    this.paymentMethodFormControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(value => {
          const description = typeof value === 'string' ? value : value?.description ?? '';
          return this.paymentMethodService.listByDescription(description);
        })
      )
      .subscribe(response => {
        this.filteredPaymentMethods = response.data;
    });
  }

  ngAfterViewInit(): void {
    if (this.selectedExpense) {
      this.selectedType = this.selectedExpense != null
        ? (this.selectedExpense.type == 1 ? ExpenseTypeEnum.Fixed : ExpenseTypeEnum.Variable)
        : ExpenseTypeEnum.Fixed;

      const dateObj = moment(this.data.row.date, 'YYYY-MM-DD').toDate();

      this.form.get('type')?.setValue(this.selectedType);
      this.categoryFormControl.setValue(this.selectedExpense.category); 
      this.selectedCategory = this.selectedExpense.category;
      this.paymentMethodFormControl.setValue(this.selectedExpense.paymentMethod);
      this.selectedPaymentMethod = this.selectedExpense.paymentMethod;
      this.form.get('description')?.setValue(this.selectedExpense.description);
      this.form.get('date')?.setValue(dateObj);
      this.form.get('paymentMethod')?.setValue(this.selectedExpense.paymentMethod);
      this.form.get('amount')?.setValue(formatToBRL(this.selectedExpense.amount));
      this.form.get('isActive')?.setValue(this.data.row.isPaid);
    } else {
      const dateObj = moment(new Date(), 'YYYY-MM-DD').toDate();
      this.form.get('date')?.setValue(dateObj);
      this.form.get('isActive')?.setValue(true);
    }

    this.form.get('type')?.setValue(this.selectedType);
  }

  onCategoryClick() {
    if (this.categoryFormControl.value) {
      return;
    }

    this.categoryService.listByName('').subscribe(response => {
      this.filteredCategories = response.data;
    });
  }

  displayCategory(category: CategoryModel | string | null): string {
    return typeof category === 'string'
      ? category
      : category?.name ?? '';
  }

  onCategorySelected(event: any) {
    this.selectedCategory = event.option.value as CategoryModel;
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
    this.selectedPaymentMethod = event.option.value as PaymentMethodModel;
  }

  onAmountInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value;
    value = value.replace(/\D/g, '');
    const numericValue = parseFloat(value) / 100;

    this.form.get('amount')?.setValue(formatToBRL(numericValue), { emitEvent: false });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  submit() {
    this.form.markAllAsTouched();
    this.categoryFormControl.markAsTouched();
    this.paymentMethodFormControl.markAsTouched();
                  
    if (this.form.valid && this.categoryFormControl.valid && this.paymentMethodFormControl.valid) {
      if (this.isNewExpense) {
        this.create();
      } else {
        this.update();
      }
    }
  }

  create() {
    debugger;
    let date = new Date(this.form.get('date')?.value as Date).toISOString().split('T')[0];
    let categoryId = this.selectedCategory?.id ?? '';
    let paymentMethodId = this.selectedPaymentMethod?.id ?? '';

    var request: CreateExpenseRequest = {
      type: this.form.get('type')?.value == 'Fixed' ? 1 : 2,
      date: date,
      description: this.form.get('description')?.value,
      amount: this.getAmountAsFloat(),
      isPaid: this.form.get('isActive')?.value,
      categoryId: categoryId,
      paymentMethodId: paymentMethodId
    };
    
    this.expenseService.create(request).subscribe({
      next: (response) => {
        this.notificationService.success(`Gasto ${response.data.description} criado com sucesso`);
        this.dialogRef.close();
      },
      error: (response) => {
        this.notificationService.errors(response.error.errors);
      }
    })
  }

  update() {
    let date = new Date(this.form.get('date')?.value as Date).toISOString().split('T')[0];
    let categoryId = this.selectedCategory?.id ?? '';
    let paymentMethodId = this.selectedPaymentMethod?.id ?? '';

    var request: UpdateExpenseRequest = {
        id: this.selectedExpense?.id ?? '',
        type: this.form.get('type')?.value == 'Fixed' ? 1 : 2,
        date: date,
        description: this.form.get('description')?.value,
        amount: this.getAmountAsFloat(),
        isPaid: this.form.get('isActive')?.value,
        categoryId: categoryId,
        paymentMethodId: paymentMethodId
      };

      this.expenseService.update(request).subscribe({
        next: (response) => {
          this.notificationService.success(`Gasto ${response.data.description} atualizado com sucesso`);
          this.dialogRef.close();
        },
        error: (response) => {
          this.notificationService.errors(response.error.errors);
        }
      })
  }

  delete() {
    var id = this.selectedExpense?.id ?? '';

    this.expenseService.delete(id).subscribe({
        next: (response) => {
          this.notificationService.success(`Gasto ${response.data.description} removido com sucesso`);
          this.dialogRef.close();
        },
        error: (response) => {
          this.notificationService.errors(response.error.errors);
        }
      })
  }

  formatAmount(event: any): void {
    let formatted = formatAmount(event);
    this.form.get('amount')?.setValue(formatted, { emitEvent: false });
  }

  formatDate(event: any) {
    formatDate(event);
  }

  getAmountAsFloat() {
    let amount = this.form.get('amount')?.value.replace(/\./g, '').replace(',', '.');

    return amount != '' ? parseFloat(amount) : 0;
  }

  
}
