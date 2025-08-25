import { Injectable } from "@angular/core";
import { IncomesAndExpensesModel } from "../responses/dashboard/incomes-and-expenses.model";
import { ApiResponse } from "../responses/api-response";
import { Observable } from "rxjs";
import { apiRoute } from "../constants";
import { HttpClient } from "@angular/common/http";
import { ExpensesByCategoryModel } from "../responses/dashboard/expenses-by-category.model";
import { ExpensesByPaymentMethodModel } from "../responses/dashboard/expenses-by-payment-method.model";

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
    dashboardRoute = '/api/dashboards';
    incomesAndExpensesRoute = '/incomes-expenses';
    expensesByCategoryRoute = '/expenses-by-category';
    expensesByPaymentMethodRoute = '/expenses-by-payment-method';

    constructor(
        private http: HttpClient
    ) {}

    getIncomesAndExpensesAmountPerMonth(month: number, year: number): Observable<ApiResponse<IncomesAndExpensesModel>> {
        return this.http.get<ApiResponse<IncomesAndExpensesModel>>(
            `${apiRoute}${this.dashboardRoute}${this.incomesAndExpensesRoute}`,
            { 
                params: {
                    month: month,
                    year: year
                }
            }
        );
    }

    getExpensesByCategoryByMonth(month: number, year: number) : Observable<ApiResponse<ExpensesByCategoryModel[]>> {
        return this.http.get<ApiResponse<ExpensesByCategoryModel[]>>(
            `${apiRoute}${this.dashboardRoute}${this.expensesByCategoryRoute}`,
            { 
                params: {
                    month: month,
                    year: year
                }
            }
        );
    }

    getExpensesByPaymentMethodByMonth(month: number, year: number) : Observable<ApiResponse<ExpensesByPaymentMethodModel[]>> {
        return this.http.get<ApiResponse<ExpensesByPaymentMethodModel[]>>(
            `${apiRoute}${this.dashboardRoute}${this.expensesByPaymentMethodRoute}`,
            { 
                params: {
                    month: month,
                    year: year
                }
            }
        );
    }
}