import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { investmentService } from "@/services/crudServices";
import type {
  CreateInvestmentRequest,
  UpdateInvestmentRequest,
  SearchInvestmentRequest,
} from "@/types/requests";

export const investmentKeys = {
  all: ["investments"] as const,
  list: (params: SearchInvestmentRequest) => ["investments", "list", params] as const,
  detail: (id: string) => ["investments", id] as const,
};

export function useInvestments(params: SearchInvestmentRequest) {
  return useQuery({
    queryKey: investmentKeys.list(params),
    queryFn: async () => {
      const res = await investmentService.listPaginated(params);
      return { items: res.data ?? [], totalCount: res.totalCount };
    },
  });
}

export function useCreateInvestment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateInvestmentRequest) => investmentService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: investmentKeys.all });
    },
  });
}

export function useUpdateInvestment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateInvestmentRequest) => investmentService.update(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: investmentKeys.all });
    },
  });
}

export function useDeleteInvestment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => investmentService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: investmentKeys.all });
    },
  });
}
