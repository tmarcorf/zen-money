import { SortDirection } from "../../enums/sort-direction.enum";
import { SortField } from "../../enums/sort-field.enum";
import { BaseSearchRequest } from "../base-search.request";

export interface SearchCategoryRequest extends BaseSearchRequest{
    name?: string;
    sortField?: SortField | null;
    sortDirection?: SortDirection | null;
}