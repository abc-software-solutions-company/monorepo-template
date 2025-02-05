import { useMutation, useQuery } from '@tanstack/react-query';

import { FaqFilter, FaqFormData } from '../interfaces/faqs.interface';

import { QUERY_FAQ_DETAIL, QUERY_FAQ_LIST } from '../constants/faqs.constant';

import FaqApi from '../api/faqs.api';

export const useGetFaqsQuery = (filter: FaqFilter) => {
  return useQuery({
    queryKey: [QUERY_FAQ_LIST, filter],
    queryFn: async () => {
      const response = await FaqApi.list(filter);

      return response.data;
    },
    staleTime: 0,
  });
};

export const useGetFaqQuery = ({ id, enabled = true }: { id: string; enabled?: boolean }) => {
  return useQuery({
    queryKey: [QUERY_FAQ_DETAIL, id],
    queryFn: async () => {
      const response = await FaqApi.read(id);

      return response.data;
    },
    enabled,
    staleTime: 0,
  });
};

export const useCreateFaqMutation = () => {
  return useMutation({
    mutationFn: async (newFaq: FaqFormData) => {
      const response = await FaqApi.create(newFaq);

      return response.data;
    },
  });
};

export const useUpdateFaqMutation = () => {
  return useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FaqFormData }) => {
      const response = await FaqApi.update(id, formData);

      return response.data;
    },
  });
};

export const useDestroyFaqMutation = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await FaqApi.destroy(id);

      return response.data;
    },
  });
};

export const useBulkDestroyFaqsMutation = () => {
  return useMutation({
    mutationFn: async (ids: string[]) => {
      const response = await FaqApi.bulkDestroy(ids);

      return response.data;
    },
  });
};
