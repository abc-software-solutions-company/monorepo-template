import { objectToQueryString } from '@repo/shared-universal/utils/string.util';

import { CreatePostDto, PostFilter, PostResponse, PostsResponse, UpdatePostDto } from '../interfaces/posts.interface';

import { API_ENDPOINTS } from '@/constants/api-endpoint.constant';

import axiosClient from '@/http/http-request';

export const list = (filter: PostFilter) => {
  const url = API_ENDPOINTS.POSTS + '?' + objectToQueryString(filter);

  return axiosClient.get<PostsResponse>(url);
};

export const create = (createPostDto: CreatePostDto) => {
  return axiosClient.post<PostResponse>(API_ENDPOINTS.POSTS, createPostDto);
};

export const read = (id: string) => {
  return axiosClient.get<PostResponse>(`${API_ENDPOINTS.POSTS}/${id}`);
};

export const update = (id: string, updatePostDto: UpdatePostDto) => {
  return axiosClient.patch<PostResponse>(`${API_ENDPOINTS.POSTS}/${id}`, updatePostDto);
};

export const destroy = (id: string) => {
  return axiosClient.delete<PostResponse>(`${API_ENDPOINTS.POSTS}/${id}`);
};

export const bulkDestroy = (payload: { ids: string[] }) => {
  return axiosClient.post<PostsResponse>(`${API_ENDPOINTS.POSTS}/bulk-delete`, payload);
};

const PostApi = { list, create, read, update, destroy, bulkDestroy };

export default PostApi;
