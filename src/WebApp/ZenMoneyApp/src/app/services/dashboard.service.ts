import { Injectable } from "@angular/core";
import { IncomesAndExpensesModel } from "../responses/dashboard/incomes-and-expenses.model";
import { ApiResponse } from "../responses/api-response";
import { Observable } from "rxjs";
import { apiRoute } from "../constants";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
    dashboardRoute = '/api/dashboards';
    incomesAndExpensesRoute = '/incomes-expenses';

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
}