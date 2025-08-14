import { BaseSearchRequest } from "../base-search.request";

export interface SearchIncomeRequest extends BaseSearchRequest {
    type?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
}