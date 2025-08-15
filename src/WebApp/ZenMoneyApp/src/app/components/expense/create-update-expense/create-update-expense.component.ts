import { Component, Inject } from '@angular/core';
import { ExpenseModel } from '../../../responses/expense/expense-model';
import { ExpenseTypeEnum } from '../../../enums/expense-type.enum';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { validDateValidator } from '../../../utils/date.formats';
import { ExpenseService } from '../../../services/expense.service';
import { NotificationService } from '../../../services/notification.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import moment from 'moment';
import { CreateExpenseRequest } from '../../../requests/expense/create-expense.request';
import { UpdateExpenseRequest } from '../../../requests/expense/update-expense.request';
import { CategoryModel } from '../../../responses/category/category-model';
import { PaymentMethodModel } from '../../../responses/payment-method/payment-method.model';

@Component({
  selector: 'app-create-update-expense',
  standalone: false,
  templateUrl: './create-update-expense.component.html',
  styleUrl: './create-update-expense.component.scss'
})
export class CreateUpdateExpenseComponent {
  isNewExpense: boolean = false;
  selectedExpense?: ExpenseModel;
  expenseTypes = Object.values(ExpenseTypeEnum);
  selectedType = ExpenseTypeEnum.Fixed;
  isPaid: boolean = true;
  isDisabled: boolean = false;


  categories: CategoryModel[] = [
    {
        id: "cat-550e8400-e29b-41d4-a716-446655440001",
        name: "Alimentação",
        createdAt: "2024-01-15T10:30:00.000Z",
        updatedAt: "2024-01-15T10:30:00.000Z"
    },
    {
        id: "cat-550e8400-e29b-41d4-a716-446655440002",
        name: "Transporte",
        createdAt: "2024-02-20T14:45:30.000Z",
        updatedAt: "2024-03-10T09:20:15.000Z"
    },
    {
        id: "cat-550e8400-e29b-41d4-a716-446655440003",
        name: "Saúde",
        createdAt: "2024-03-05T08:15:20.000Z",
        updatedAt: "2024-03-05T08:15:20.000Z"
    },
    {
        id: "cat-550e8400-e29b-41d4-a716-446655440004",
        name: "Lazer",
        createdAt: "2024-04-12T16:40:55.000Z",
        updatedAt: "2024-05-08T11:25:30.000Z"
    },
    {
        id: "cat-550e8400-e29b-41d4-a716-446655440005",
        name: "Moradia",
        createdAt: "2024-05-18T09:10:45.000Z",
        updatedAt: "2024-05-18T09:10:45.000Z"
    }
  ];
  paymentMethods: PaymentMethodModel[] = [
    {
        id: "pm-550e8400-e29b-41d4-a716-446655440001",
        description: "Cartão de Crédito Visa",
        createdAt: "2024-01-10T08:30:00.000Z",
        updatedAt: "2024-01-10T08:30:00.000Z"
    },
    {
        id: "pm-550e8400-e29b-41d4-a716-446655440002",
        description: "Cartão de Débito Mastercard",
        createdAt: "2024-01-15T14:20:15.000Z",
        updatedAt: "2024-02-05T10:45:30.000Z"
    },
    {
        id: "pm-550e8400-e29b-41d4-a716-446655440003",
        description: "PIX",
        createdAt: "2024-02-01T09:15:40.000Z",
        updatedAt: "2024-02-01T09:15:40.000Z"
    },
    {
        id: "pm-550e8400-e29b-41d4-a716-446655440004",
        description: "Dinheiro",
        createdAt: "2024-03-10T16:25:55.000Z",
        updatedAt: "2024-04-12T11:30:20.000Z"
    },
    {
        id: "pm-550e8400-e29b-41d4-a716-446655440005",
        description: "Transferência Bancária",
        createdAt: "2024-04-18T12:40:10.000Z",
        updatedAt: "2024-04-18T12:40:10.000Z"
    }
];

  form: FormGroup = new FormGroup({
    type: new FormControl('', Validators.required),
    category: new FormControl(''),
    description: new FormControl('', [
      Validators.required,
      Validators.maxLength(100)
    ]),
    date: new FormControl('', [
      Validators.required,
      validDateValidator()
    ]),
    paymentMethod: new FormControl(''),
    amount: new FormControl('', [
      Validators.required,
    ]),
    isPaid: new FormControl(''),
  });

  constructor(
    private expenseService: ExpenseService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<CreateUpdateExpenseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {row: ExpenseModel, isNewExpenseDialog: boolean}){
      this.selectedExpense = data.row;
      this.isNewExpense = data.isNewExpenseDialog;
    }

  ngAfterViewInit(): void {
    if (this.selectedExpense) {
      this.selectedType = this.data.row != null
        ? (this.data.row.type == 1 ? ExpenseTypeEnum.Fixed : ExpenseTypeEnum.Variable)
        : ExpenseTypeEnum.Fixed;

      const dateObj = moment(this.data.row.date, 'YYYY-MM-DD').toDate();

      this.form.get('type')?.setValue(this.selectedType);
      this.form.get('description')?.setValue(this.selectedExpense.description);
      this.form.get('date')?.setValue(dateObj);

      // Formata valor vindo do backend
      this.form.get('amount')?.setValue(this.formatToBRL(this.selectedExpense.amount));

      this.isPaid = this.data.row.isPaid;
    }
  }

  formatToBRL(value: number | string): string {
    if (value === null || value === undefined) return '';
    let numericValue = typeof value === 'number'
      ? value
      : parseFloat(value.toString().replace(/\./g, '').replace(',', '.'));

    if (isNaN(numericValue)) return '';

    return numericValue.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  onAmountInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value;
    value = value.replace(/\D/g, '');
    const numericValue = parseFloat(value) / 100;

    this.form.get('amount')?.setValue(this.formatToBRL(numericValue), { emitEvent: false });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  submit() {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    if (this.isNewExpense) {
      this.create();
    } else {
      this.update();
    }
  }

  create() {
    let date = new Date(this.form.get('date')?.value as Date).toISOString().split('T')[0];
    let categoryId = this.form.get('category')?.value;
    let paymentMethodId = this.form.get('paymentMethod')?.value;

    var request: CreateExpenseRequest = {
      type: this.form.get('type')?.value == 'Fixed' ? 1 : 2,
      date: date,
      description: this.form.get('description')?.value,
      amount: this.getAmountAsFloat(),
      isPaid: this.form.get('isPaid')?.value,
      categoryId: categoryId,
      paymentMethodId: paymentMethodId
    };
    
    this.expenseService.create(request).subscribe({
      next: (response) => {
        this.notificationService.success(`Entrada ${response.data.description} criada com sucesso`);
        this.dialogRef.close();
      },
      error: (response) => {
        this.notificationService.errors(response.error.errors);
      }
    })
  }

  update() {
    let date = new Date(this.form.get('date')?.value as Date).toISOString().split('T')[0];
    let categoryId = this.form.get('category')?.value;
    let paymentMethodId = this.form.get('paymentMethod')?.value;

    var request: UpdateExpenseRequest = {
        id: this.data.row.id,
        type: this.form.get('type')?.value == 'Fixed' ? 1 : 2,
        date: date,
        description: this.form.get('description')?.value,
        amount: this.getAmountAsFloat(),
        isPaid: this.form.get('isPaid')?.value,
        categoryId: categoryId,
        paymentMethodId: paymentMethodId
      };

      this.expenseService.update(request).subscribe({
        next: (response) => {
          this.notificationService.success(`Entrada ${response.data.description} atualizada com sucesso`);
          this.dialogRef.close();
        },
        error: (response) => {
          this.notificationService.errors(response.error.errors);
        }
      })
  }

  delete() {
    var id = this.data.row.id;

    this.expenseService.delete(id).subscribe({
        next: (response) => {
          this.notificationService.success(`Entrada ${response.data.description} removida com sucesso`);
          this.dialogRef.close();
        },
        error: (response) => {
          this.notificationService.errors(response.error.errors);
        }
      })
  }

  formatDate(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 2) {
      value = value.substring(0, 2) + '/' + value.substring(2);
    }
    if (value.length > 5) {
      value = value.substring(0, 5) + '/' + value.substring(5, 9);
    }
    event.target.value = value;
  }

  formatAmount(event: any): void {
    // Remove tudo que não for número
    let value = event.target.value.replace(/\D/g, '');

    // Converte para número com duas casas decimais
    let numericValue = (parseInt(value, 10) / 100).toFixed(2);

    // Formata no padrão brasileiro
    const formatted = new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(Number(numericValue));

    // Atualiza o valor no campo
    this.form.get('amount')?.setValue(formatted, { emitEvent: false });
  }

  getAmountAsFloat() {
    let amount = this.form.get('amount')?.value.replace(/\./g, '').replace(',', '.');

    return amount != '' ? parseFloat(amount) : 0;
  }
}
