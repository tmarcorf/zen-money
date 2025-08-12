import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiRoute, EXP_DATE, USER_NAME } from '../constants';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthUserRequest } from '../requests/user/auth-user.request';
import { ApiResponse } from '../responses/api-response';
import { TokenModel } from '../responses/user/token-model';
import { StorageService } from './storage.service';
import { Router } from '@angular/router';
import { CreateUserRequest } from '../requests/user/create-user.request';
import { UserModel } from '../responses/user/user-model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
    userRoute = '/api/users';
    userAuthRoute = '/api/users/auth';

    private isLoggedInSubject = new BehaviorSubject<boolean>(this.checkInitialLoginState());
    public isLoggedIn$ = this.isLoggedInSubject.asObservable();

    constructor(
        private http: HttpClient,
        private storageService: StorageService,
        private router: Router
    ) {}
    
    login(request: AuthUserRequest): Observable<ApiResponse<TokenModel>> {
        return this.http.post<ApiResponse<TokenModel>>(`${apiRoute}${this.userAuthRoute}`, request);
    }

    create(request: CreateUserRequest) : Observable<ApiResponse<UserModel>> {
        return this.http.post<ApiResponse<UserModel>>(`${apiRoute}${this.userRoute}`, request);
    }

    private checkInitialLoginState(): boolean {
        const dataMinima: Date = new Date(1000, 0, 1);
        var dateString = this.storageService.get(EXP_DATE) != '' ? this.storageService.get(EXP_DATE) : dataMinima.toISOString() ;
        var expirationDate = new Date(dateString);
        var now = new Date();

        return now < expirationDate;
    }

    isLoggedIn(): boolean {
        return this.isLoggedInSubject.value;
    }

    logout(): void {
        this.storageService.clear();
        this.isLoggedInSubject.next(false);
        this.router.navigate(['/login']);
    }

    updateLoginState(): void {
        this.isLoggedInSubject.next(this.checkInitialLoginState());
    }

    public getFirstName(): string {
        return this.storageService.get(USER_NAME);
    }
}