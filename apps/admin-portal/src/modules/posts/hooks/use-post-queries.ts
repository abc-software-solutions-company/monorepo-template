import { useMutation, useQuery } from '@tanstack/react-query';

import { CreatePostDto, PostFilter, UpdatePostDto } from '../interfaces/posts.interface';

import { QUERY_POST_DETAIL, QUERY_POST_LIST } from '../constants/posts.constant';

import PostApi from '../api/posts.api';

export const useGetPostsQuery = (filter: PostFilter) => {
  return useQuery({
    queryKey: [QUERY_POST_LIST, filter],
    queryFn: async () => {
      const response = await PostApi.list(filter);

      return response.data;
    },
    staleTime: 0,
  });
};

export const useGetPostQuery = ({ id, enabled = true }: { id: string; enabled?: boolean }) => {
  return useQuery({
    queryKey: [QUERY_POST_DETAIL, id],
    queryFn: async () => {
      const response = await PostApi.read(id);

      return response.data;
    },
    enabled,
    staleTime: 0,
  });
};

export const useCreatePostMutation = () => {
  return useMutation({
    mutationFn: async (newPost: CreatePostDto) => {
      const response = await PostApi.create(newPost);

      return response.data;
    },
  });
};

export const useUpdatePostMutation = () => {
  return useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: UpdatePostDto }) => {
      const response = await PostApi.update(id, formData);

      return response.data;
    },
  });
};

export const useDestroyPostMutation = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await PostApi.destroy(id);

      return response.data;
    },
  });
};

export const useBulkDestroyPostsMutation = () => {
  return useMutation({
    mutationFn: async (ids: string[]) => {
      const response = await PostApi.bulkDestroy({ ids });

      return response.data;
    },
  });
};
