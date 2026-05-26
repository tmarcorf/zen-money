export interface ErrorDetail {
  code: string;
  message: string;
}

export interface ApiResponse<T> {
  code: string;
  data: T;
  isSuccess: boolean;
  errors: ErrorDetail[];
  totalCount: number;
  timestamp: string;
}
