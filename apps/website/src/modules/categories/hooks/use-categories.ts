import { QueryFunctionContext, useQuery } from '@tanstack/react-query';

import { CategoryFilter, CategoryResponse } from '../interfaces/categories.interface';

import { prefetchData } from '@/utils/prefetch.util';

import CategoryApi from '../api/categories.api';

const LIST = 'hydrate-categories';
const SINGLE = 'hydrate-category';

const fetchCategories = async ({ queryKey }: QueryFunctionContext) => {
  const [, filter] = queryKey as [string, CategoryFilter];
  const res = await CategoryApi.list(filter || {});

  return res.data;
};

const fetchCategory = async ({ queryKey }: QueryFunctionContext): Promise<CategoryResponse> => {
  const [, id] = queryKey as [string, string];

  const res = await CategoryApi.read(id);

  return res.data;
};

const prefetchCategories = async () => {
  const dehydratedState = await prefetchData([LIST], fetchCategories);

  return dehydratedState;
};

const prefetchCategory = async (id: string) => {
  const dehydratedState = await prefetchData([SINGLE, id], fetchCategory);

  return dehydratedState;
};

const useCategories = (filter?: CategoryFilter) => {
  return useQuery({ queryKey: [LIST, filter], queryFn: fetchCategories });
};

const useCategory = (id: string) => {
  return useQuery({ queryKey: [SINGLE, id], queryFn: fetchCategory });
};

export { prefetchCategories, prefetchCategory, useCategories, useCategory };
