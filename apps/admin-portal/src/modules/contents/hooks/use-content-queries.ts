import { useMutation, useQuery } from '@tanstack/react-query';

import { ContentFilter, ContentFormData } from '../interfaces/contents.interface';

import { QUERY_CONTENT_DETAIL, QUERY_CONTENT_LIST } from '../constants/contents.constant';

import ContentApi from '../api/contents.api';

export const useGetContentsQuery = (filter: ContentFilter) => {
  return useQuery({
    queryKey: [QUERY_CONTENT_LIST, filter],
    queryFn: async () => {
      const response = await ContentApi.list(filter);

      return response.data;
    },
    staleTime: 0,
  });
};

export const useGetContentQuery = ({ id, enabled = true }: { id: string; enabled?: boolean }) => {
  return useQuery({
    queryKey: [QUERY_CONTENT_DETAIL, id],
    queryFn: async () => {
      const response = await ContentApi.read(id);

      return response.data.data;
    },
    enabled,
    staleTime: 0,
  });
};

export const useCreateContentMutation = () => {
  return useMutation({
    mutationFn: async (newContent: ContentFormData) => {
      const response = await ContentApi.create(newContent);

      return response.data;
    },
  });
};

export const useUpdateContentMutation = () => {
  return useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: ContentFormData }) => {
      const response = await ContentApi.update(id, formData);

      return response.data;
    },
  });
};

export const useDestroyContentMutation = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await ContentApi.destroy(id);

      return response.data;
    },
  });
};

export const useBulkDestroyContentsMutation = () => {
  return useMutation({
    mutationFn: async (ids: string[]) => {
      const response = await ContentApi.bulkDestroy(ids);

      return response.data;
    },
  });
};
