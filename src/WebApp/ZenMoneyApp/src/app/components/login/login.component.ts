import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { AuthUserRequest } from '../../requests/user/authUserRequest';
import { StorageService } from '../../services/storage.service';
import { TOKEN_KEY, EXP_DATE, USER_NAME } from '../../constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  constructor(
    private userService: UserService,
    private storageService: StorageService,
    private router: Router) { }

  form: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  submit() {
    const email = this.form.get('email')?.value;
    const password = this.form.get('password')?.value;

    let request: AuthUserRequest = {
      email: email,
      password: password
    };

    this.userService.login(request).subscribe({
      next: (response) => {
        console.log("Login efetuado com sucesso!");
        
        this.storageService.set(TOKEN_KEY, response.data.token);
        this.storageService.set(EXP_DATE, response.data.expiration);
        this.storageService.set(USER_NAME, response.data.firstName);
        this.userService.updateLoginState();
        this.router.navigate(['/dashboard']);
      },
      error: (response) => {
        console.error('Erro ao fazer login:', response.errors[0].message);
      }
    })
  }

}
