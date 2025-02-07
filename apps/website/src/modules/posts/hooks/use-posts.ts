import { QueryFunctionContext, useQuery } from '@tanstack/react-query';

import { PostFilter, PostResponse } from '../interfaces/posts.interface';

import { prefetchData } from '@/utils/prefetch.util';

import PostApi from '../api/posts.api';

const LIST = 'hydrate-posts';
const SINGLE = 'hydrate-post';

const fetchPosts = async ({ queryKey }: QueryFunctionContext) => {
  const [, filter] = queryKey as [string, PostFilter];
  const res = await PostApi.list(filter || {});

  return res.data;
};

const fetchPost = async ({ queryKey }: QueryFunctionContext): Promise<PostResponse> => {
  const [, id] = queryKey as [string, string];

  const res = await PostApi.read(id);

  return res.data;
};

const prefetchPosts = async () => {
  const dehydratedState = await prefetchData([LIST], fetchPosts);

  return dehydratedState;
};

const prefetchPost = async (id: string) => {
  const dehydratedState = await prefetchData([SINGLE, id], fetchPost);

  return dehydratedState;
};

const usePosts = (filter?: PostFilter) => {
  return useQuery({ queryKey: [LIST, filter], queryFn: fetchPosts });
};

const usePost = (id: string) => {
  return useQuery({ queryKey: [SINGLE, id], queryFn: fetchPost });
};

export { prefetchPost, prefetchPosts, usePost, usePosts };
