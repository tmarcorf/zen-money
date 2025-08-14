import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { TOKEN_KEY } from '../constants';
import { NotificationService } from '../services/notification.service';
import { UserService } from '../services/user.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private storageService: StorageService,
    private notificationService: NotificationService,
    private userService: UserService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.storageService.get(TOKEN_KEY);

    if (!token) {
      return next.handle(req);
    }

    // Sempre envia a requisição, com ou sem token
    const cloned = token
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;

    return next.handle(cloned).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.resetSession();
        } else if(error.status === 0) {
          this.userService.updateLoginState();

          if (this.userService.isLoggedIn()) {
            this.notificationService.error('Não foi possível conectar-se ao servidor. Tente novamente.');
          } else {
            this.resetSession();
          }
          
        }
        return throwError(() => error);
      })
    );
  }

  resetSession() {
    this.notificationService.error('Sessão expirada. Faça login novamente.');
    this.storageService.clear();
    this.userService.updateLoginState();
    this.router.navigate(['/login']);
  }
}

