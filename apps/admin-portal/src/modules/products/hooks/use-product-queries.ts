import { useMutation, useQuery } from '@tanstack/react-query';

import { ProductFilter, ProductFormData } from '../interfaces/products.interface';

import { QUERY_PRODUCT_DETAIL, QUERY_PRODUCT_LIST } from '../constants/products.constant';

import ProductApi from '../api/products.api';

export const useGetProductsQuery = (filter: ProductFilter) => {
  return useQuery({
    queryKey: [QUERY_PRODUCT_LIST, filter],
    queryFn: async () => {
      const response = await ProductApi.list(filter);

      return response.data;
    },
    staleTime: 0,
  });
};

export const useGetProductQuery = ({ id, enabled = true }: { id: string; enabled?: boolean }) => {
  return useQuery({
    queryKey: [QUERY_PRODUCT_DETAIL, id],
    queryFn: async () => {
      const response = await ProductApi.read(id);

      return response.data;
    },
    enabled,
    staleTime: 0,
  });
};

export const useCreateProductMutation = () => {
  return useMutation({
    mutationFn: async (newProduct: ProductFormData) => {
      const response = await ProductApi.create(newProduct);

      return response.data;
    },
  });
};

export const useUpdateProductMutation = () => {
  return useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: ProductFormData }) => {
      const response = await ProductApi.update(id, formData);

      return response.data;
    },
  });
};

export const useDestroyProductMutation = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await ProductApi.destroy(id);

      return response.data;
    },
  });
};

export const useBulkDestroyProductsMutation = () => {
  return useMutation({
    mutationFn: async (ids: string[]) => {
      const response = await ProductApi.bulkDestroy({ ids });

      return response.data;
    },
  });
};
