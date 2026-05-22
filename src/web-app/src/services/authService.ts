import { api } from "./api";

// Request interfaces
export interface AuthUserRequest {
  email: string;
  password: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string; // ISO format date string
}

export interface UpdateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string; // ISO format date string
}

// Response interfaces
export interface TokenModel {
  firstName: string;
  email: string;
  token: string;
  expiration: string; // ISO format date string
}

export interface UserModel {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string; // ISO format date string
}

export interface ApiResponse<T> {
  code: string;
  data: T;
  isSuccess: boolean;
  errors: Array<{
    code: string;
    message: string;
  }>;
  totalCount: number;
  timestamp: string; // ISO format date string
}

// Authentication service
export const authService = {
  // Authenticate user and get JWT token
  authenticate: async (request: AuthUserRequest): Promise<ApiResponse<TokenModel>> => {
    return api.post<ApiResponse<TokenModel>>("/api/users/auth", request);
  },

  // Create a new user account
  createUser: async (request: CreateUserRequest): Promise<ApiResponse<UserModel>> => {
    return api.post<ApiResponse<UserModel>>("/api/users", request);
  },

  // Get user by ID (requires authentication)
  getUserById: async (id: string): Promise<ApiResponse<UserModel>> => {
    return api.get<ApiResponse<UserModel>>(`/api/users/${id}`);
  },

  // Update user information (requires authentication)
  updateUser: async (request: UpdateUserRequest): Promise<ApiResponse<UserModel>> => {
    return api.put<ApiResponse<UserModel>>("/api/users", request);
  },

  // Validate current token (requires authentication)
  validateToken: async (): Promise<ApiResponse<boolean>> => {
    return api.get<ApiResponse<boolean>>("/api/users/validate");
  },
};