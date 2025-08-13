import { BaseSearchRequest } from "../base-search.request";

export interface SearchPaymentMethodRequest extends BaseSearchRequest {
    description?: string;
}