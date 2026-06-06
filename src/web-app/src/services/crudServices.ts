import { apiClient } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import type { ApiResponse } from "@/types/api";
import type {
  CreateExpenseRequest,
  UpdateExpenseRequest,
  SearchExpenseRequest,
  CreateIncomeRequest,
  UpdateIncomeRequest,
  SearchIncomeRequest,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  SearchCategoryRequest,
  CreatePaymentMethodRequest,
  UpdatePaymentMethodRequest,
  SearchPaymentMethodRequest,
  CreateInvestmentRequest,
  UpdateInvestmentRequest,
  SearchInvestmentRequest,
} from "@/types/requests";
import type {
  ExpenseModel,
  IncomeModel,
  CategoryModel,
  PaymentMethodModel,
  InvestmentModel,
} from "@/types/entities";

export const expenseService = {
  getById: (id: string) =>
    apiClient.get<ApiResponse<ExpenseModel>>(ENDPOINTS.expenses, { id }),

  listPaginated: (params: SearchExpenseRequest) =>
    apiClient.get<ApiResponse<ExpenseModel[]>>(ENDPOINTS.expensesPaginated, params as Record<string, unknown>),

  create: (data: CreateExpenseRequest) =>
    apiClient.post<ApiResponse<ExpenseModel>>(ENDPOINTS.expenses, data),

  update: (data: UpdateExpenseRequest) =>
    apiClient.put<ApiResponse<ExpenseModel>>(ENDPOINTS.expenses, data),

  delete: (id: string) =>
    apiClient.delete<ApiResponse<ExpenseModel>>(ENDPOINTS.expenses, { id }),
};

export const incomeService = {
  getById: (id: string) =>
    apiClient.get<ApiResponse<IncomeModel>>(ENDPOINTS.incomes, { id }),

  listPaginated: (params: SearchIncomeRequest) =>
    apiClient.get<ApiResponse<IncomeModel[]>>(ENDPOINTS.incomesPaginated, params as Record<string, unknown>),

  create: (data: CreateIncomeRequest) =>
    apiClient.post<ApiResponse<IncomeModel>>(ENDPOINTS.incomes, data),

  update: (data: UpdateIncomeRequest) =>
    apiClient.put<ApiResponse<IncomeModel>>(ENDPOINTS.incomes, data),

  delete: (id: string) =>
    apiClient.delete<ApiResponse<IncomeModel>>(ENDPOINTS.incomes, { id }),
};

export const categoryService = {
  getById: (id: string) =>
    apiClient.get<ApiResponse<CategoryModel>>(ENDPOINTS.categories, { id }),

  listPaginated: (params: SearchCategoryRequest) =>
    apiClient.get<ApiResponse<CategoryModel[]>>(ENDPOINTS.categoriesPaginated, params as Record<string, unknown>),

  listByName: (name?: string) =>
    apiClient.get<ApiResponse<CategoryModel[]>>(ENDPOINTS.categoriesByName, name !== undefined ? { name } : undefined),

  create: (data: CreateCategoryRequest) =>
    apiClient.post<ApiResponse<CategoryModel>>(ENDPOINTS.categories, data),

  update: (data: UpdateCategoryRequest) =>
    apiClient.put<ApiResponse<CategoryModel>>(ENDPOINTS.categories, data),

  delete: (id: string) =>
    apiClient.delete<ApiResponse<CategoryModel>>(ENDPOINTS.categories, { id }),
};

export const investmentService = {
  getById: (id: string) =>
    apiClient.get<ApiResponse<InvestmentModel>>(ENDPOINTS.investments, { id }),

  listPaginated: (params: SearchInvestmentRequest) =>
    apiClient.get<ApiResponse<InvestmentModel[]>>(ENDPOINTS.investmentsPaginated, params as Record<string, unknown>),

  create: (data: CreateInvestmentRequest) =>
    apiClient.post<ApiResponse<InvestmentModel>>(ENDPOINTS.investments, data),

  update: (data: UpdateInvestmentRequest) =>
    apiClient.put<ApiResponse<InvestmentModel>>(ENDPOINTS.investments, data),

  delete: (id: string) =>
    apiClient.delete<ApiResponse<InvestmentModel>>(ENDPOINTS.investments, { id }),
};

export const paymentMethodService = {
  getById: (id: string) =>
    apiClient.get<ApiResponse<PaymentMethodModel>>(ENDPOINTS.paymentMethods, { id }),

  listPaginated: (params: SearchPaymentMethodRequest) =>
    apiClient.get<ApiResponse<PaymentMethodModel[]>>(ENDPOINTS.paymentMethodsPaginated, params as Record<string, unknown>),

  listByDescription: (description?: string) =>
    apiClient.get<ApiResponse<PaymentMethodModel[]>>(ENDPOINTS.paymentMethodsByDescription, description !== undefined ? { description } : undefined),

  create: (data: CreatePaymentMethodRequest) =>
    apiClient.post<ApiResponse<PaymentMethodModel>>(ENDPOINTS.paymentMethods, data),

  update: (data: UpdatePaymentMethodRequest) =>
    apiClient.put<ApiResponse<PaymentMethodModel>>(ENDPOINTS.paymentMethods, data),

  delete: (id: string) =>
    apiClient.delete<ApiResponse<PaymentMethodModel>>(ENDPOINTS.paymentMethods, { id }),
};
