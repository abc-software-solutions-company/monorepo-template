import { EntityId } from '@reduxjs/toolkit';
import { objectToQueryString } from '~shared-universal/utils/string.util';

import { ContentFilter, ContentFormData, ContentResponse, ContentsResponse } from '../interfaces/contents.interface';

import { API_ENDPOINTS } from '@/constants/api-endpoint.constant';

import axiosClient from '@/http/http-request';

export const list = (filter: ContentFilter) => {
  const url = API_ENDPOINTS.CONTENTS + '?' + objectToQueryString(filter);

  return axiosClient.get<ContentsResponse>(url);
};

export const create = (createContentDto: ContentFormData) => {
  return axiosClient.post<ContentResponse>(API_ENDPOINTS.CONTENTS, createContentDto);
};

export const read = (id: EntityId) => {
  return axiosClient.get<ContentResponse>(`${API_ENDPOINTS.CONTENTS}/${id}`);
};

export const update = (id: EntityId, updateContentDto: ContentFormData) => {
  return axiosClient.patch<ContentResponse>(`${API_ENDPOINTS.CONTENTS}/${id}`, updateContentDto);
};

export const destroy = (id: EntityId) => {
  return axiosClient.delete<ContentResponse>(`${API_ENDPOINTS.CONTENTS}/${id}`);
};

export const bulkDestroy = (ids: EntityId[]) => {
  return axiosClient.post<ContentsResponse>(`${API_ENDPOINTS.CONTENTS}/bulk-delete`, { ids });
};

const ContentApi = { list, create, read, update, destroy, bulkDestroy };

export default ContentApi;
