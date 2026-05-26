import { apiClient } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import type { ApiResponse } from "@/types/api";
import type { UserModel, TokenModel } from "@/types/entities";
import type { AuthUserRequest, CreateUserRequest, UpdateUserRequest } from "@/types/requests";

export const userService = {
  authenticate: (data: AuthUserRequest) =>
    apiClient.post<ApiResponse<TokenModel>>(ENDPOINTS.auth.authenticate, data),

  validateToken: () =>
    apiClient.get<ApiResponse<boolean>>(ENDPOINTS.auth.validateToken),

  getById: (id: string) =>
    apiClient.get<ApiResponse<UserModel>>(ENDPOINTS.users, { id }),

  create: (data: CreateUserRequest) =>
    apiClient.post<ApiResponse<UserModel>>(ENDPOINTS.users, data),

  update: (data: UpdateUserRequest) =>
    apiClient.put<ApiResponse<UserModel>>(ENDPOINTS.users, data),
};
