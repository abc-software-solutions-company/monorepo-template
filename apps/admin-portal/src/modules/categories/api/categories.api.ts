import { objectToQueryString } from '@repo/shared-universal/utils/string.util';

import { CategoriesResponse, CategoryFilter, CategoryFormData, CategoryResponse } from '../interfaces/categories.interface';

import { API_ENDPOINTS } from '@/constants/api-endpoint.constant';

import axiosClient from '@/http/http-request';

export const list = (filter: CategoryFilter) => {
  const url = API_ENDPOINTS.CATEGORIES + '?' + objectToQueryString(filter);

  return axiosClient.get<CategoriesResponse>(url);
};

export const create = (createCategoryDto: CategoryFormData) => {
  return axiosClient.post<CategoryResponse>(API_ENDPOINTS.CATEGORIES, createCategoryDto);
};

export const read = (id: string) => {
  return axiosClient.get<CategoryResponse>(`${API_ENDPOINTS.CATEGORIES}/${id}`);
};

export const update = (id: string, updateCategoryDto: CategoryFormData) => {
  return axiosClient.patch<CategoryResponse>(`${API_ENDPOINTS.CATEGORIES}/${id}`, updateCategoryDto);
};

export const destroy = (id: string) => {
  return axiosClient.delete<CategoryResponse>(`${API_ENDPOINTS.CATEGORIES}/${id}`);
};

export const bulkDestroy = (payload: { ids: string[] }) => {
  return axiosClient.post<CategoriesResponse>(`${API_ENDPOINTS.CATEGORIES}/bulk-delete`, payload);
};

const CategoryApi = { list, create, read, update, destroy, bulkDestroy };

export default CategoryApi;
