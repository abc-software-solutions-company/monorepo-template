import { QueryFunctionContext, useQuery } from '@tanstack/react-query';

import { ProductFilter, ProductResponse } from '../interfaces/products.interface';

import { prefetchData } from '@/utils/prefetch.util';

import ProductApi from '../api/products.api';

const LIST = 'hydrate-products';
const SINGLE = 'hydrate-product';

const fetchProducts = async ({ queryKey }: QueryFunctionContext) => {
  const [, filter] = queryKey as [string, ProductFilter];
  const res = await ProductApi.list(filter || {});

  return res.data;
};

const fetchProduct = async ({ queryKey }: QueryFunctionContext): Promise<ProductResponse> => {
  const [, id] = queryKey as [string, string];

  const res = await ProductApi.read(id);

  return res.data;
};

const prefetchProducts = async () => {
  const dehydratedState = await prefetchData([LIST], fetchProducts);

  return dehydratedState;
};

const prefetchProduct = async (id: string) => {
  const dehydratedState = await prefetchData([SINGLE, id], fetchProduct);

  return dehydratedState;
};

const useProducts = (filter?: ProductFilter) => {
  return useQuery({ queryKey: [LIST, filter], queryFn: fetchProducts });
};

const useProduct = (id: string) => {
  return useQuery({ queryKey: [SINGLE, id], queryFn: fetchProduct });
};

export { prefetchProduct, prefetchProducts, useProduct, useProducts };
