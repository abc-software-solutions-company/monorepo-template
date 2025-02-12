import { objectToQueryString } from '@repo/shared-universal/utils/string.util';

import { CategoriesResponse, CategoryFilter, CategoryResponse } from '../interfaces/categories.interface';

import { API_ENDPOINTS } from '@/constants/api-endpoint.constant';
import { CATEGORY_TYPE } from '../constants/categories.constant';

import axiosClient from '@/http/http-request';

export const list = (filter: CategoryFilter) => {
  const url = API_ENDPOINTS.CATEGORIES + '?' + objectToQueryString(filter);

  return axiosClient.get<CategoriesResponse>(url);
};

export const read = (id: string) => {
  return axiosClient.get<CategoryResponse>(`${API_ENDPOINTS.CATEGORIES}/${id}`);
};

export async function getServerCategories(filter: CategoryFilter) {
  const q = '?' + objectToQueryString(filter);

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${API_ENDPOINTS.CATEGORIES}${q}`, {
    next: { revalidate: 60 },
  });
  const json = await res.json();

  return json as CategoriesResponse;
}

export async function getServerCategoriesByParentId(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${API_ENDPOINTS.CATEGORIES}/.by.parent.id/${id}`, {
    next: { revalidate: 60 },
  });
  const json = await res.json();

  return json as CategoriesResponse;
}

export async function getServerCategoriesByType(type: CATEGORY_TYPE) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${API_ENDPOINTS.CATEGORIES}/.by.type/${type}`, {
    next: { revalidate: 60 },
  });
  const json = await res.json();

  return json as CategoriesResponse;
}

export async function getServerCategoryBySlug(slug: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${API_ENDPOINTS.CATEGORIES}/.by.slug/${slug}`, {
    next: { revalidate: 60 },
  });
  const json = await res.json();

  return json as CategoryResponse;
}

const CategoryApi = {
  list,
  read,
  getServerCategories,
  getServerCategoriesByParentId,
  getServerCategoriesByType,
  getServerCategoryBySlug,
};

export default CategoryApi;
