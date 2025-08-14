import { Component, Inject } from '@angular/core';
import { IncomeModel } from '../../../responses/income/income.model';
import { FormControl, FormGroup } from '@angular/forms';
import { IncomeService } from '../../../services/income.service';
import { NotificationService } from '../../../services/notification.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UpdateIncomeRequest } from '../../../requests/income/update-income.request';
import { CreateIncomeRequest } from '../../../requests/income/create-income.request';
import { IncomeTypeEnum } from '../../../enums/income-type.enum';

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
      type: new FormControl(''),
      description: new FormControl(''),
      date: new FormControl(''),
      amount: new FormControl('')
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
    if(this.selectedIncome) {
      this.form.get('type')?.setValue(this.selectedIncome.type);
      this.form.get('description')?.setValue(this.selectedIncome.description);
      this.form.get('date')?.setValue(this.selectedIncome.date);
      this.form.get('amount')?.setValue(this.selectedIncome.amount);
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  submit() {
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
      amount: this.form.get('amount')?.value
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
        amount: this.form.get('amount')?.value
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
}
