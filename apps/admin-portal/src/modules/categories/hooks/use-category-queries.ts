/*
 * @Author: <Tin Tran> (tin.tran@abcdigital.io)
 * @Created: 2025-01-17 14:55:52
 */

import { useQuery } from '@tanstack/react-query';

import { CATEGORY_TYPE } from '../constants/categories.constant';

import CategoryApi from '../api/categories.api';

export const useGetCategoriesQuery = (filter: { type?: CATEGORY_TYPE }) => {
  return useQuery({
    queryKey: ['QUERY_CATEGORY_LIST', filter],
    queryFn: async () => {
      const response = await CategoryApi.list(filter);

      return response.data;
    },
    staleTime: 0,
  });
};
