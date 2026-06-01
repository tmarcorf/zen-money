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

  /** Checks if there is an active session (HttpOnly cookie) and returns the current user.
   *  Uses skipAuthRedirect so a 401 doesn't trigger a full-page redirect — the auth context handles it. */
  getMe: () =>
    apiClient.get<ApiResponse<UserModel>>(ENDPOINTS.auth.me, undefined, { skipAuthRedirect: true }),

  /** Clears the auth cookie server-side. */
  logout: () =>
    apiClient.post<ApiResponse<boolean>>(ENDPOINTS.auth.logout),

  getById: (id: string) =>
    apiClient.get<ApiResponse<UserModel>>(ENDPOINTS.users, { id }),

  create: (data: CreateUserRequest) =>
    apiClient.post<ApiResponse<UserModel>>(ENDPOINTS.users, data),

  update: (data: UpdateUserRequest) =>
    apiClient.put<ApiResponse<UserModel>>(ENDPOINTS.users, data),
};
