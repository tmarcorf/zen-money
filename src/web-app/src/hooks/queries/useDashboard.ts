import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboardService";

export const dashboardKeys = {
  all: ["dashboard"] as const,
  incomesExpenses: (month: number, year: number) => ["dashboard", "incomes-expenses", month, year] as const,
  expensesByCategory: (month: number, year: number) => ["dashboard", "expenses-by-category", month, year] as const,
  expensesByPaymentMethod: (month: number, year: number) => ["dashboard", "expenses-by-payment-method", month, year] as const,
};

export function useDashboardIncomesExpenses(month: number, year: number) {
  return useQuery({
    queryKey: dashboardKeys.incomesExpenses(month, year),
    queryFn: async () => {
      const res = await dashboardService.getIncomesAndExpenses(month, year);
      return res.data;
    },
  });
}

export function useDashboardExpensesByCategory(month: number, year: number) {
  return useQuery({
    queryKey: dashboardKeys.expensesByCategory(month, year),
    queryFn: async () => {
      const res = await dashboardService.getExpensesByCategory(month, year);
      return res.data ?? [];
    },
  });
}

export function useDashboardExpensesByPaymentMethod(month: number, year: number) {
  return useQuery({
    queryKey: dashboardKeys.expensesByPaymentMethod(month, year),
    queryFn: async () => {
      const res = await dashboardService.getExpensesByPaymentMethod(month, year);
      return res.data ?? [];
    },
  });
}
