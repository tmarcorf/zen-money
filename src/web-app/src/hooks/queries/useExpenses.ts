import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { expenseService } from "@/services/crudServices";
import type {
  CreateExpenseRequest,
  UpdateExpenseRequest,
  SearchExpenseRequest,
} from "@/types/requests";

export const expenseKeys = {
  all: ["expenses"] as const,
  list: (params: SearchExpenseRequest) => ["expenses", "list", params] as const,
  detail: (id: string) => ["expenses", id] as const,
};

export function useExpenses(params: SearchExpenseRequest) {
  return useQuery({
    queryKey: expenseKeys.list(params),
    queryFn: async () => {
      const res = await expenseService.listPaginated(params);
      return { items: res.data ?? [], totalCount: res.totalCount };
    },
  });
}

export function useCreateExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateExpenseRequest) => expenseService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: expenseKeys.all });
    },
  });
}

export function useUpdateExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateExpenseRequest) => expenseService.update(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: expenseKeys.all });
    },
  });
}

export function useDeleteExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => expenseService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: expenseKeys.all });
    },
  });
}
