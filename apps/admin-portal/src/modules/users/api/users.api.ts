import { EntityId } from '@reduxjs/toolkit';
import { objectToQueryString } from '@repo/shared-universal/utils/string.util';

import { UserChangeAvatarResponse, UserFilter, UserFormData, UserResponse, UsersResponse } from '../interfaces/users.interface';

import { API_ENDPOINTS } from '@/constants/api-endpoint.constant';

import axiosClient from '@/http/http-request';

export const list = (filter: UserFilter) => {
  const url = API_ENDPOINTS.USERS + '?' + objectToQueryString(filter);

  return axiosClient.get<UsersResponse>(url);
};

export const create = (createUserDto: UserFormData) => {
  return axiosClient.post<UserResponse>(API_ENDPOINTS.USERS, createUserDto);
};

export const read = (id: EntityId) => {
  return axiosClient.get<UserResponse>(`${API_ENDPOINTS.USERS}/${id}`);
};

export const update = (id: EntityId, updateUserDto: UserFormData) => {
  return axiosClient.patch<UserResponse>(`${API_ENDPOINTS.USERS}/${id}`, updateUserDto);
};

export const destroy = (id: EntityId) => {
  return axiosClient.delete<UserResponse>(`${API_ENDPOINTS.USERS}/${id}`);
};

export const bulkDestroy = (payload: { ids: EntityId[] }) => {
  return axiosClient.post<UsersResponse>(`${API_ENDPOINTS.USERS}/bulk-delete`, payload);
};

export const changeAvatar = (file: Blob) => {
  const formData = new FormData();

  formData.append('avatar', file);

  return axiosClient.post<UserChangeAvatarResponse>(API_ENDPOINTS.CHANGE_AVATAR, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

const UserApi = { list, create, read, update, destroy, bulkDestroy, changeAvatar };

export default UserApi;
