import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { StorageService } from '../../services/storage.service';
import { NotificationService } from '../../services/notification.service';
import { Router } from '@angular/router';
import { provideNativeDateAdapter } from '@angular/material/core';
import { dateFormatValidator } from '../../utils/date.formats';
import { passwordMatchValidator } from '../../utils/custom.validators';
import { CreateUserRequest } from '../../requests/user/create-user.request';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.scss',
  providers: [provideNativeDateAdapter()]
})
export class CreateAccountComponent {
  form: FormGroup = new FormGroup({
      firstName: new FormControl('', [
        Validators.required
      ]),
      lastName: new FormControl('', [
        Validators.required
      ]),
      dateOfBirth: new FormControl('', [
        Validators.required,
        dateFormatValidator()
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl('', [
        Validators.required
      ]),
      confirmPassword: new FormControl('', [
        Validators.required
      ])
    },
    { 
      validators: passwordMatchValidator('password', 'confirmPassword') 
    });
  
  constructor(
      private userService: UserService,
      private storageService: StorageService,
      private notificationService: NotificationService,
      private router: Router) { }

  submit() {
    this.form.markAllAsTouched();

    if(this.form.invalid) {
      return;
    }

    const firstName = this.form.get('firstName')?.value;
    const lastName = this.form.get('lastName')?.value;
    const dateOfBirth = new Date(this.form.get('dateOfBirth')?.value as Date).toISOString().split('T')[0];
    const email = this.form.get('email')?.value;
    const password = this.form.get('password')?.value;

    var request: CreateUserRequest = {
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
      dateOfBirth: dateOfBirth
    };

    console.log(request.dateOfBirth);

    this.userService.create(request).subscribe({
      next: (response) => {
        var userName = response.data.firstName;
        this.notificationService.success("Usuário " + userName + " criado com sucesso");
        this.router.navigate(['/login']);
      },
      error: (response) => {
        this.notificationService.errors(response.error.errors);
      }
    });

    
  }

  isFormValid(): boolean {
    if(this.form.get('firstName')?.value == '') {
      this.notificationService.error("Insira o nome");
      return false;
    }
    
    return true;
  }
}
