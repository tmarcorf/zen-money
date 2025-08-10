import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private _snackBar = inject(MatSnackBar);

  private horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  private verticalPosition: MatSnackBarVerticalPosition = 'top';

  success(message: string) {
    const config = new MatSnackBarConfig();
    config.panelClass = ['snackbar-success'];
    config.duration = 4500;
    config.horizontalPosition = this.horizontalPosition;
    config.verticalPosition = this.verticalPosition;

    this._snackBar.open(message, 'OK', config);
  }

  error(message: string) {
    const config = new MatSnackBarConfig();
    config.panelClass = ['snackbar-error'];
    config.duration = 4500;
    config.horizontalPosition = this.horizontalPosition;
    config.verticalPosition = this.verticalPosition;

    this._snackBar.open(message, 'OK', config);
  }

  errors(errors: Error[]) {
    if (errors) {
      for (let i = 0; i < errors.length; i++) {
        this.error(errors[i].message);
      }
    }
  }
}
