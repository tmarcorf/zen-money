import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private _snackBar = inject(MatSnackBar);

  private horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  private verticalPosition: MatSnackBarVerticalPosition = 'top';

  private getBaseConfig(): MatSnackBarConfig {
    return {
      duration: 4500,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    };
  }

  success(message: string) {
    this._snackBar.open(message, 'OK', {
      duration: 4500,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['snackbar-success'],
      // Força a aplicação da classe no container principal
      politeness: 'polite'
    });
  }

  error(message: string) {
    this._snackBar.open(message, 'OK', {
      duration: 4500,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['snackbar-error'],
      // Força a aplicação da classe no container principal
      politeness: 'assertive'
    });
  }

  errors(errors: Error[]) {
    if (errors) {
      for (let i = 0; i < errors.length; i++) {
        this.error(errors[i].message);
      }
    }
  }
}
