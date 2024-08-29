import { ProfileFormData, ProfileResponse } from '../interfaces/profile.interface';

import { API_ENDPOINTS } from '@/constants/api-endpoint.constant';

import axiosClient from '@/http/http-request';

export const update = (updateDto: ProfileFormData) => {
  return axiosClient.patch<ProfileResponse>(API_ENDPOINTS.PROFILE, updateDto);
};

export const me = () => {
  return axiosClient.get<ProfileResponse>(`${API_ENDPOINTS.ME}`);
};

const ProfileApi = { me, update };

export default ProfileApi;
