import { api } from "./api";
import { UserModel, UpdateUserRequest, ApiResponse } from "./authService";

// User service
export const userService = {
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