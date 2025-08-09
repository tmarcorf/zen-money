import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiRoute, EXP_DATE, USER_NAME } from '../constants';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthUserRequest } from '../requests/user/authUserRequest';
import { ApiResponse } from '../responses/apiResponse';
import { TokenModel } from '../responses/user/tokenModel';
import { StorageService } from './storage.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
    userRoute = '/api/users/auth';

    private isLoggedInSubject = new BehaviorSubject<boolean>(this.checkInitialLoginState());
    public isLoggedIn$ = this.isLoggedInSubject.asObservable();

    constructor(
        private http: HttpClient,
        private storageService: StorageService,
        private router: Router
    ) {}
    
    login(request: AuthUserRequest): Observable<ApiResponse<TokenModel>> {
        return this.http.post<ApiResponse<TokenModel>>(`${apiRoute}${this.userRoute}`, request);
    }

    private checkInitialLoginState(): boolean {
        var expirationDate = new Date(this.storageService.get(EXP_DATE));
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