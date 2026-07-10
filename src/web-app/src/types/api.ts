export interface ErrorDetail {
  code: string;
  message: string;
}

export interface ApiResponse<T> {
  code: string;
  data: T;
  isSuccess: boolean;
  error: ErrorDetail | null;
  totalCount: number;
  timestamp: string;
}
