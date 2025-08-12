import { Error } from "./error";

export interface ApiResponse<T> {
    code: string;
    data: T;
    totalCount: number;
    isSuccess: boolean;
    errors: Error[];
    timestamp: string;
}
