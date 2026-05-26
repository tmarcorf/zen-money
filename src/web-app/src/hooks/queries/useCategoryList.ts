import { useQuery } from "@tanstack/react-query";
import { categoryService, paymentMethodService } from "@/services/crudServices";

export const listKeys = {
  categories: ["categories", "all"] as const,
  paymentMethods: ["paymentMethods", "all"] as const,
};

export function useCategoryList() {
  return useQuery({
    queryKey: listKeys.categories,
    queryFn: async () => {
      const res = await categoryService.listPaginated({ take: 100 });
      return res.data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function usePaymentMethodList() {
  return useQuery({
    queryKey: listKeys.paymentMethods,
    queryFn: async () => {
      const res = await paymentMethodService.listPaginated({ take: 100 });
      return res.data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });
}
