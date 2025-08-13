import { SortDirection } from "../enums/sort-direction.enum";
import { SortField } from "../enums/sort-field.enum";

export interface BaseSearchRequest {
    offset: number;
    take: number;
    sortField?: SortField | null;
    sortDirection?: SortDirection | null;
}