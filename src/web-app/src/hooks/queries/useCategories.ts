import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "@/services/crudServices";
import type {
  CreateCategoryRequest,
  UpdateCategoryRequest,
  SearchCategoryRequest,
} from "@/types/requests";

export const categoryKeys = {
  all: ["categories"] as const,
  list: (params: SearchCategoryRequest) => ["categories", "list", params] as const,
  detail: (id: string) => ["categories", id] as const,
};

export function useCategories(params: SearchCategoryRequest) {
  return useQuery({
    queryKey: categoryKeys.list(params),
    queryFn: async () => {
      const res = await categoryService.listPaginated(params);
      return { items: res.data ?? [], totalCount: res.totalCount };
    },
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCategoryRequest) => categoryService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateCategoryRequest) => categoryService.update(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => categoryService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}
