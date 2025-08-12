import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { Router } from '@angular/router';
import { CategoryModel } from '../responses/category/category-model';
import { ApiResponse } from '../responses/api-response';
import { apiRoute } from '../constants';
import { SearchCategoryRequest } from '../requests/category/search-category.request';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
    allCategoriesRoute = '/api/categories/all';

    constructor(
        private http: HttpClient,
        private storageService: StorageService,
        private router: Router
    ) {}

    getAll(request: SearchCategoryRequest): Observable<ApiResponse<CategoryModel[]>> {
        return this.http.get<ApiResponse<CategoryModel[]>>(
            `${apiRoute}${this.allCategoriesRoute}`,
            { 
                params: {
                    offset: request.offset ?? 0,
                    take: request.take ?? 10,
                    name: request.name ?? '',
                    sortField: request.sortField ?? '',
                    sortDirection: request.sortDirection ?? ''
                }
            }
        );
    }
}