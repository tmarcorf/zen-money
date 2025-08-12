import { BaseSearchRequest } from "../base-search.request";

export interface SearchCategoryRequest extends BaseSearchRequest{
    name?: string;
    sortField: string;
    sortDirection: string;
}