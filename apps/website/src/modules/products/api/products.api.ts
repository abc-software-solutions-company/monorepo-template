import { objectToQueryString } from '@repo/shared-universal/utils/string.util';

import { ProductFilter, ProductResponse, ProductsResponse } from '../interfaces/products.interface';

import { API_ENDPOINTS } from '@/constants/api-endpoint.constant';

import axiosClient from '@/http/http-request';

export const list = (filter: ProductFilter) => {
  const url = API_ENDPOINTS.PRODUCTS + '?' + objectToQueryString(filter);

  return axiosClient.get<ProductsResponse>(url);
};

export const read = (id: string) => {
  return axiosClient.get<ProductResponse>(`${API_ENDPOINTS.PRODUCTS}/${id}`);
};

export async function getServerProducts(filter: ProductFilter) {
  const q = '?' + objectToQueryString(filter);

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${API_ENDPOINTS.PRODUCTS}${q}`, {
    next: { revalidate: 60 },
  });
  const json = await res.json();

  return json as ProductsResponse;
}

export async function getServerProduct(slug: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${API_ENDPOINTS.PRODUCTS}/.by.slug/${slug}`, {
    next: { revalidate: 60 },
  });
  const json = await res.json();

  return json as ProductResponse;
}

const ProductApi = {
  list,
  read,
  getServerProducts,
  getServerProduct,
};

export default ProductApi;
