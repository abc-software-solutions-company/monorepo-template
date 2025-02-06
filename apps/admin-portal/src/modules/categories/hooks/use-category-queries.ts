/*
 * @Author: <Tin Tran> (tin.tran@abcdigital.io)
 * @Created: 2025-01-17 14:55:52
 */

import { useMutation, useQuery } from '@tanstack/react-query';

import { CategoryFilter, CategoryFormData } from '../interfaces/categories.interface';

import { QUERY_CATEGORY_DETAIL, QUERY_CATEGORY_LIST, QUERY_CATEGORY_LIST_BY_TYPE } from '../constants/categories.constant';

import CategoryApi from '../api/categories.api';

type UseGetCategoriesQueryProps = {
  filter: CategoryFilter;
  enabled?: boolean;
};

export const useGetCategoriesQuery = ({ filter, enabled = true }: UseGetCategoriesQueryProps) => {
  return useQuery({
    queryKey: [QUERY_CATEGORY_LIST, filter],
    queryFn: async () => {
      const response = await CategoryApi.list(filter);

      return response.data;
    },
    enabled,
    staleTime: 0,
  });
};

type UseGetCategoriesByTypeQueryProps = {
  filter: CategoryFilter;
  excludeId?: string;
  enabled?: boolean;
};

export const useGetCategoriesByTypeQuery = ({ filter, excludeId, enabled = true }: UseGetCategoriesByTypeQueryProps) => {
  return useQuery({
    queryKey: [QUERY_CATEGORY_LIST_BY_TYPE, filter],
    queryFn: async () => {
      const response = await CategoryApi.list({ type: filter.type, excludeId });

      return response.data;
    },
    enabled,
    staleTime: 0,
  });
};

type UseGetCategoryQueryProps = {
  id: string;
  enabled?: boolean;
};

export const useGetCategoryQuery = ({ id, enabled = true }: UseGetCategoryQueryProps) => {
  return useQuery({
    queryKey: [QUERY_CATEGORY_DETAIL, id],
    queryFn: async () => {
      const response = await CategoryApi.read(id);

      return response.data;
    },
    enabled,
    staleTime: 0,
  });
};

export const useCreateCategoryMutation = () => {
  return useMutation({
    mutationFn: async (newCategory: CategoryFormData) => {
      const response = await CategoryApi.create(newCategory);

      return response.data;
    },
  });
};

export const useUpdateCategoryMutation = () => {
  return useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: CategoryFormData }) => {
      const response = await CategoryApi.update(id, formData);

      return response.data;
    },
  });
};

export const useDestroyCategoryMutation = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await CategoryApi.destroy(id);

      return response.data;
    },
  });
};

export const useBulkDestroyCategoriesMutation = () => {
  return useMutation({
    mutationFn: async (ids: string[]) => {
      const response = await CategoryApi.bulkDestroy({ ids });

      return response.data;
    },
  });
};
