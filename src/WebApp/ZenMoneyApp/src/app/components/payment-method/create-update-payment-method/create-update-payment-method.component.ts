import { Component, Inject } from '@angular/core';
import { PaymentMethodModel } from '../../../responses/payment-method/payment-method.model';
import { FormControl, FormGroup } from '@angular/forms';
import { PaymentMethodService } from '../../../services/payment-method.service';
import { NotificationService } from '../../../services/notification.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CreatePaymentMethodRequest } from '../../../requests/payment-method/create-payment-method.request';
import { UpdatePaymentMethodRequest } from '../../../requests/payment-method/update-payment-method.request';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-create-update-payment-method',
  templateUrl: './create-update-payment-method.component.html',
  styleUrl: './create-update-payment-method.component.scss',
  standalone: false
})
export class CreateUpdatePaymentMethodComponent {
  isNewPaymentMethod: boolean = false;
  selectedPaymentMethod?: PaymentMethodModel;

  form: FormGroup = new FormGroup({
    description: new FormControl(''),
  });

  constructor(
    private paymentMethodService: PaymentMethodService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<CreateUpdatePaymentMethodComponent>,
    private confirmDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: {row: PaymentMethodModel, isNewPaymentMethodDialog: boolean}){
      this.selectedPaymentMethod = data.row;
      this.isNewPaymentMethod = data.isNewPaymentMethodDialog;
    }

  ngAfterViewInit(): void {
    if(this.selectedPaymentMethod) {
      this.form.get('description')?.setValue(this.selectedPaymentMethod.description);
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  submit() {
    if (this.isNewPaymentMethod) {
      this.create();
    } else {
      this.update();
    }
  }

  create() {
    var request: CreatePaymentMethodRequest = {
        description: this.form.get('description')?.value
      };

      this.paymentMethodService.create(request).subscribe({
        next: (response) => {
          this.notificationService.success(`Forma de Pagamento ${response.data.description} criada com sucesso`);
          this.dialogRef.close();
        },
        error: (response) => {
          this.notificationService.errors(response.error.errors);
        }
      })
  }

  update() {
    var request: UpdatePaymentMethodRequest = {
        id: this.data.row.id,
        description: this.form.get('description')?.value
      };

      this.paymentMethodService.update(request).subscribe({
        next: (response) => {
          this.notificationService.success(`Forma de Pagamento ${response.data.description} atualizada com sucesso`);
          this.dialogRef.close();
        },
        error: (response) => {
          this.notificationService.errors(response.error.errors);
        }
      })
  }

  delete() {
    const dialogRef = this.confirmDialog.open(ConfirmDialogComponent, {
      width: '410px',
      height: '200px',
      data: {
        title: 'Remover Forma de Pagamento',
        description: 'Deseja remover esta forma de pagamento ?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        var id = this.data.row.id;

        this.paymentMethodService.delete(id).subscribe({
          next: (response) => {
            this.notificationService.success(`Forma de Pagamento ${response.data.description} removida com sucesso`);
            this.dialogRef.close();
          },
          error: (response) => {
            this.notificationService.errors(response.error.errors);
          }
        })
      }
    })
  }
}
