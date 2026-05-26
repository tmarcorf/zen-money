import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentMethodService } from "@/services/crudServices";
import type {
  CreatePaymentMethodRequest,
  UpdatePaymentMethodRequest,
  SearchPaymentMethodRequest,
} from "@/types/requests";

export const paymentMethodKeys = {
  all: ["paymentMethods"] as const,
  list: (params: SearchPaymentMethodRequest) => ["paymentMethods", "list", params] as const,
  detail: (id: string) => ["paymentMethods", id] as const,
};

export function usePaymentMethods(params: SearchPaymentMethodRequest) {
  return useQuery({
    queryKey: paymentMethodKeys.list(params),
    queryFn: async () => {
      const res = await paymentMethodService.listPaginated(params);
      return { items: res.data ?? [], totalCount: res.totalCount };
    },
  });
}

export function useCreatePaymentMethod() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePaymentMethodRequest) => paymentMethodService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: paymentMethodKeys.all });
    },
  });
}

export function useUpdatePaymentMethod() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdatePaymentMethodRequest) => paymentMethodService.update(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: paymentMethodKeys.all });
    },
  });
}

export function useDeletePaymentMethod() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => paymentMethodService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: paymentMethodKeys.all });
    },
  });
}
