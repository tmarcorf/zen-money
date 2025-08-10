import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { AuthUserRequest } from '../../requests/user/auth-user.request';
import { StorageService } from '../../services/storage.service';
import { TOKEN_KEY, EXP_DATE, USER_NAME } from '../../constants';
import { NotificationService } from '../../services/notification.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
    standalone: false
})
export class LoginComponent implements OnInit {

  constructor(
    private userService: UserService,
    private storageService: StorageService,
    private notificationService: NotificationService,
    private router: Router) { }

  ngOnInit(): void {
    if (this.userService.isLoggedIn()) {
      this.router.navigate(['/home']);
    }
  }

  form: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  submit() {
    const email = this.form.get('email')?.value;
    const password = this.form.get('password')?.value;

    if (this.areCredentialsInvalid(email, password)) {
      this.notificationService.error("Informe um e-mail e senha válidos");
      return;
    }

    let request: AuthUserRequest = {
      email: email,
      password: password
    };

    this.userService.login(request).subscribe({
      next: (response) => {
        this.storageService.set(TOKEN_KEY, response.data.token);
        this.storageService.set(EXP_DATE, response.data.expiration);
        this.storageService.set(USER_NAME, response.data.firstName);
        this.notificationService.success("Login efetuado com sucesso");
        this.userService.updateLoginState();
        this.router.navigate(['/home']);
      },
      error: (response) => {
        this.notificationService.errors(response.error.errors);
      }
    })
  }

  areCredentialsInvalid(email: string, password: string): boolean {
    return email == null || email == ''||
          password == null || password == '';
  }
}
