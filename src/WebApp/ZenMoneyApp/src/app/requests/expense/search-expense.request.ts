import { BaseSearchRequest } from "../base-search.request";

export interface SearchExpenseRequest extends BaseSearchRequest {
    type?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
}