import { apiClient } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import type { ApiResponse } from "@/types/api";
import type { IncomesAndExpensesModel, ExpensesByCategoryModel, ExpensesByPaymentMethodModel } from "@/types/entities";

export const dashboardService = {
  getIncomesAndExpenses: (month: number, year: number) =>
    apiClient.get<ApiResponse<IncomesAndExpensesModel>>(ENDPOINTS.dashboard.incomesExpenses, { month, year }),

  getExpensesByCategory: (month: number, year: number) =>
    apiClient.get<ApiResponse<ExpensesByCategoryModel[]>>(ENDPOINTS.dashboard.expensesByCategory, { month, year }),

  getExpensesByPaymentMethod: (month: number, year: number) =>
    apiClient.get<ApiResponse<ExpensesByPaymentMethodModel[]>>(ENDPOINTS.dashboard.expensesByPaymentMethod, { month, year }),
};
