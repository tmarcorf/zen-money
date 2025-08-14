import { Injectable } from "@angular/core";
import { SearchIncomeRequest } from "../requests/income/search-income.request";
import { IncomeModel } from "../responses/income/income.model";
import { ApiResponse } from "../responses/api-response";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { apiRoute } from "../constants";
import { CreateCategoryRequest } from "../requests/category/create-category.request";
import { CreateIncomeRequest } from "../requests/income/create-income.request";
import { UpdateIncomeRequest } from "../requests/income/update-income.request";

@Injectable({
  providedIn: 'root'
})
export class IncomeService {
    incomesRoute = '/api/incomes';
    allIncomesRoute = '/api/incomes/list-paginated';

    constructor(
        private http: HttpClient
    ) {}

    listPaginated(request: SearchIncomeRequest): Observable<ApiResponse<IncomeModel[]>> {
        return this.http.get<ApiResponse<IncomeModel[]>>(
            `${apiRoute}${this.allIncomesRoute}`,
            { 
                params: {
                    type: request.type ?? '',
                    startDate: request.startDate ?? '',
                    endDate: request.endDate ?? '',
                    description: request.description ?? '',
                    offset: request.offset ?? 0,
                    take: request.take ?? 10,
                    sortField: request.sortField?.toString() ?? '',
                    sortDirection: request.sortDirection?.toString() ?? ''
                }
            }
        );
    }

    create(request: CreateIncomeRequest): Observable<ApiResponse<IncomeModel>> {
        return this.http.post<ApiResponse<IncomeModel>>(`${apiRoute}${this.incomesRoute}`, request);
    }

    update(request: UpdateIncomeRequest): Observable<ApiResponse<IncomeModel>> {
        return this.http.put<ApiResponse<IncomeModel>>(`${apiRoute}${this.incomesRoute}`, request);
    }

    delete(id: string): Observable<ApiResponse<IncomeModel>> {
        return this.http.delete<ApiResponse<IncomeModel>>(`${apiRoute}${this.incomesRoute}`,
            {
                params: {
                    id: id
                }
            }
        );
    }
}