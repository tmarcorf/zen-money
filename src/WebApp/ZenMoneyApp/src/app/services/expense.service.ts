import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { SearchExpenseRequest } from "../requests/expense/search-expense.request";
import { ExpenseModel } from "../responses/expense/expense-model";
import { ApiResponse } from "../responses/api-response";
import { apiRoute } from "../constants";
import { CreateExpenseRequest } from "../requests/expense/create-expense.request";
import { UpdateExpenseRequest } from "../requests/expense/update-expense.request";

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
    expensesRoute = '/api/expenses';
    allExpensesRoute = '/api/expenses/list-paginated';

    constructor(
        private http: HttpClient
    ) {}

    listPaginated(request: SearchExpenseRequest): Observable<ApiResponse<ExpenseModel[]>> {
        return this.http.get<ApiResponse<ExpenseModel[]>>(
            `${apiRoute}${this.allExpensesRoute}`,
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

    create(request: CreateExpenseRequest): Observable<ApiResponse<ExpenseModel>> {
        return this.http.post<ApiResponse<ExpenseModel>>(`${apiRoute}${this.expensesRoute}`, request);
    }

    update(request: UpdateExpenseRequest): Observable<ApiResponse<ExpenseModel>> {
        return this.http.put<ApiResponse<ExpenseModel>>(`${apiRoute}${this.expensesRoute}`, request);
    }

    delete(id: string): Observable<ApiResponse<ExpenseModel>> {
        return this.http.delete<ApiResponse<ExpenseModel>>(`${apiRoute}${this.expensesRoute}`,
            {
                params: {
                    id: id
                }
            }
        );
    }
}