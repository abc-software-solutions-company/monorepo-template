import { objectToQueryString } from '@repo/shared-universal/utils/string.util';

import { ProductFilter, ProductFormData, ProductResponse, ProductsResponse } from '../interfaces/products.interface';

import { API_ENDPOINTS } from '@/constants/api-endpoint.constant';

import axiosClient from '@/http/http-request';

export const list = (filter: ProductFilter) => {
  const url = API_ENDPOINTS.PRODUCTS + '?' + objectToQueryString(filter);

  return axiosClient.get<ProductsResponse>(url);
};

export const create = (createProductDto: ProductFormData) => {
  return axiosClient.post<ProductResponse>(API_ENDPOINTS.PRODUCTS, createProductDto);
};

export const read = (id: string) => {
  return axiosClient.get<ProductResponse>(`${API_ENDPOINTS.PRODUCTS}/${id}`);
};

export const update = (id: string, updateProductDto: ProductFormData) => {
  return axiosClient.patch<ProductResponse>(`${API_ENDPOINTS.PRODUCTS}/${id}`, updateProductDto);
};

export const destroy = (id: string) => {
  return axiosClient.delete<ProductResponse>(`${API_ENDPOINTS.PRODUCTS}/${id}`);
};

export const bulkDestroy = (payload: { ids: string[] }) => {
  return axiosClient.post<ProductsResponse>(`${API_ENDPOINTS.PRODUCTS}/bulk-delete`, payload);
};

const ProductApi = { list, create, read, update, destroy, bulkDestroy };

export default ProductApi;
