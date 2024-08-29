import { ResponseFormat } from '@/interfaces/api-response.interface';

import { UserEntity } from '@/modules/users/interfaces/users.interface';

export type AuthEntity = {
  user: UserEntity;
  accessToken: string;
};

export type RefreshTokenEntity = {
  accessToken: string;
};

export type SignInDto = {
  email: string;
  password: string;
};

export type ForgotPasswordDto = {
  email: string;
};

export type ResetPasswordDto = {
  otpCode: string;
  password: string;
  confirmPassword: string;
};

export type SignInResponse = ResponseFormat<AuthEntity>;
export type SignOutResponse = ResponseFormat<{ status: string }>;
export type RefreshTokenResponse = ResponseFormat<RefreshTokenEntity>;
export type ForgotPasswordResponse = ResponseFormat<{ code: string }>;
