import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SearchPaymentMethodRequest } from "../requests/payment-method/search-payment-method.request";
import { PaymentMethodModel } from "../responses/payment-method/payment-method.model";
import { ApiResponse } from "../responses/api-response";
import { Observable } from "rxjs";
import { apiRoute } from "../constants";

@Injectable({
  providedIn: 'root'
})
export class PaymentMethodService {
    paymentMethodRoute = '/api/payment-methods';
    allPaymentMethodsRoute = '/api/payment-methods/list-paginated';

    constructor(
        private http: HttpClient
    ) {}

    listPaginated(request: SearchPaymentMethodRequest): Observable<ApiResponse<PaymentMethodModel[]>> {
        return this.http.get<ApiResponse<PaymentMethodModel[]>>(
            `${apiRoute}${this.allPaymentMethodsRoute}`,
            { 
                params: {
                    offset: request.offset ?? 0,
                    take: request.take ?? 10,
                    description: request.description ?? '',
                    sortField: request.sortField?.toString() ?? '',
                    sortDirection: request.sortDirection?.toString() ?? ''
                }
            }
        );
    }
}