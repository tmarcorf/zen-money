import { Error } from "./error";

export interface ApiResponse<T> {
    code: string;
    data: T;
    isSuccess: boolean;
    errors: Error[];
    timestamp: string;
}
