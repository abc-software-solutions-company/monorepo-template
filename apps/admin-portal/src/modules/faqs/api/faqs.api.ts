import { EntityId } from '@reduxjs/toolkit';
import { objectToQueryString } from '@repo/shared-universal/utils/string.util';

import { FaqFilter, FaqFormData, FaqResponse, FaqsResponse } from '../interfaces/faqs.interface';

import { API_ENDPOINTS } from '@/constants/api-endpoint.constant';

import axiosClient from '@/http/http-request';

export const list = (filter: FaqFilter) => {
  const url = API_ENDPOINTS.FAQS + '?' + objectToQueryString(filter);

  return axiosClient.get<FaqsResponse>(url);
};

export const create = (createFaqDto: FaqFormData) => {
  return axiosClient.post<FaqResponse>(API_ENDPOINTS.FAQS, createFaqDto);
};

export const read = (id: EntityId) => {
  return axiosClient.get<FaqResponse>(`${API_ENDPOINTS.FAQS}/${id}`);
};

export const update = (id: EntityId, updateFaqDto: FaqFormData) => {
  return axiosClient.patch<FaqResponse>(`${API_ENDPOINTS.FAQS}/${id}`, updateFaqDto);
};

export const destroy = (id: EntityId) => {
  return axiosClient.delete<FaqResponse>(`${API_ENDPOINTS.FAQS}/${id}`);
};

export const bulkDestroy = (ids: EntityId[]) => {
  return axiosClient.post<FaqsResponse>(`${API_ENDPOINTS.FAQS}/bulk-delete`, { ids });
};

const FaqApi = { list, create, read, update, destroy, bulkDestroy };

export default FaqApi;
