import { Component, Inject } from '@angular/core';
import { IncomeModel } from '../../../responses/income/income.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IncomeService } from '../../../services/income.service';
import { NotificationService } from '../../../services/notification.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UpdateIncomeRequest } from '../../../requests/income/update-income.request';
import { CreateIncomeRequest } from '../../../requests/income/create-income.request';
import { IncomeTypeEnum } from '../../../enums/income-type.enum';
import moment from 'moment';
import { validDateValidator } from '../../../utils/date.formats';

@Component({
  selector: 'app-create-update-income',
  standalone: false,
  templateUrl: './create-update-income.component.html',
  styleUrl: './create-update-income.component.scss'
})
export class CreateUpdateIncomeComponent {
  isNewIncome: boolean = false;
  selectedIncome?: IncomeModel;
  incomeTypes = Object.values(IncomeTypeEnum);
  selectedType = IncomeTypeEnum.Fixed;

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
    ])
  });

  constructor(
    private incomeService: IncomeService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<CreateUpdateIncomeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {row: IncomeModel, isNewIncomeDialog: boolean}){
      this.selectedIncome = data.row;
      this.isNewIncome = data.isNewIncomeDialog;
    }

  ngAfterViewInit(): void {
    if (this.selectedIncome) {
      this.selectedType = this.data.row != null
        ? (this.data.row.type == 1 ? IncomeTypeEnum.Fixed : IncomeTypeEnum.Variable)
        : IncomeTypeEnum.Fixed;

      const dateObj = moment(this.data.row.date, 'YYYY-MM-DD').toDate();

      this.form.get('type')?.setValue(this.selectedType);
      this.form.get('description')?.setValue(this.selectedIncome.description);
      this.form.get('date')?.setValue(dateObj);

      // Formata valor vindo do backend
      this.form.get('amount')?.setValue(this.formatToBRL(this.selectedIncome.amount));
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

    if (this.isNewIncome) {
      this.create();
    } else {
      this.update();
    }
  }

  create() {
    let date = new Date(this.form.get('date')?.value as Date).toISOString().split('T')[0];

    var request: CreateIncomeRequest = {
      type: this.form.get('type')?.value == 'Fixed' ? 1 : 2,
      description: this.form.get('description')?.value,
      date: date,
      amount: this.getAmountAsFloat()
    };
    
    this.incomeService.create(request).subscribe({
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

    var request: UpdateIncomeRequest = {
        id: this.data.row.id,
        type: this.form.get('type')?.value == 'Fixed' ? 1 : 2,
        description: this.form.get('description')?.value,
        date: date,
        amount: this.getAmountAsFloat()
      };

      this.incomeService.update(request).subscribe({
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

    this.incomeService.delete(id).subscribe({
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
