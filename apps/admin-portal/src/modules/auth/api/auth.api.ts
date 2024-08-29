import { SignInDto, SignInResponse, SignOutResponse } from '../interfaces/auth.interface';

import { API_ENDPOINTS } from '@/constants/api-endpoint.constant';

import axiosClient from '@/http/http-request';

export const signIn = (signInDto: SignInDto) => {
  return axiosClient.post<SignInResponse>(API_ENDPOINTS.SIGN_IN, signInDto);
};

export const signOut = () => {
  return axiosClient.post<SignOutResponse>(API_ENDPOINTS.SIGN_OUT);
};

const AuthApi = { signIn, signOut };

export default AuthApi;
