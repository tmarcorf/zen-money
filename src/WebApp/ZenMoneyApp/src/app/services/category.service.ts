import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { Router } from '@angular/router';
import { CategoryModel } from '../responses/category/category-model';
import { ApiResponse } from '../responses/api-response';
import { apiRoute } from '../constants';
import { SearchCategoryRequest } from '../requests/category/search-category.request';
import { CreateCategoryRequest } from '../requests/category/create-category.request';
import { UpdateCategoryRequest } from '../requests/category/update-category.request';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
    categoriesRoute = '/api/categories';
    allCategoriesRoute = '/api/categories/list-paginated';
    listByNameRoute = '/api/categories/list-name';

    constructor(
        private http: HttpClient
    ) {}

    listPaginated(request: SearchCategoryRequest): Observable<ApiResponse<CategoryModel[]>> {
        return this.http.get<ApiResponse<CategoryModel[]>>(
            `${apiRoute}${this.allCategoriesRoute}`,
            { 
                params: {
                    offset: request.offset ?? 0,
                    take: request.take ?? 10,
                    name: request.name ?? '',
                    sortField: request.sortField?.toString() ?? '',
                    sortDirection: request.sortDirection?.toString() ?? ''
                }
            }
        );
    }

    listByName(name: string): Observable<ApiResponse<CategoryModel[]>> {
        return this.http.get<ApiResponse<CategoryModel[]>>(
            `${apiRoute}${this.listByNameRoute}`,
            { 
                params: {
                    name: name
                }
            }
        );
    }

    create(request: CreateCategoryRequest): Observable<ApiResponse<CategoryModel>> {
        return this.http.post<ApiResponse<CategoryModel>>(`${apiRoute}${this.categoriesRoute}`, request);
    }

    update(request: UpdateCategoryRequest): Observable<ApiResponse<CategoryModel>> {
        return this.http.put<ApiResponse<CategoryModel>>(`${apiRoute}${this.categoriesRoute}`, request);
    }

    delete(id: string): Observable<ApiResponse<CategoryModel>> {
        return this.http.delete<ApiResponse<CategoryModel>>(`${apiRoute}${this.categoriesRoute}`,
            {
                params: {
                    id: id
                }
            }
        );
    }
}