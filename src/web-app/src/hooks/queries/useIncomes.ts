import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { incomeService } from "@/services/crudServices";
import type {
  CreateIncomeRequest,
  UpdateIncomeRequest,
  SearchIncomeRequest,
} from "@/types/requests";

export const incomeKeys = {
  all: ["incomes"] as const,
  list: (params: SearchIncomeRequest) => ["incomes", "list", params] as const,
  detail: (id: string) => ["incomes", id] as const,
};

export function useIncomes(params: SearchIncomeRequest) {
  return useQuery({
    queryKey: incomeKeys.list(params),
    queryFn: async () => {
      const res = await incomeService.listPaginated(params);
      return { items: res.data ?? [], totalCount: res.totalCount };
    },
  });
}

export function useCreateIncome() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateIncomeRequest) => incomeService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: incomeKeys.all });
    },
  });
}

export function useUpdateIncome() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateIncomeRequest) => incomeService.update(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: incomeKeys.all });
    },
  });
}

export function useDeleteIncome() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => incomeService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: incomeKeys.all });
    },
  });
}
