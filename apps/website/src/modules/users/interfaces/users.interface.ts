import { ResponseFormat } from '@/interfaces/api-response.interface';
import { BaseFilter } from '@/interfaces/filter.interface';

import { USER_GENDER, USER_ROLE, USER_STATUS } from '../constants/users.constant';

import { AUTH_PROVIDER, AUTH_TYPE } from '@/modules/auth/constants/auth.constant';
import { PreferenceEntity } from '@/modules/settings/interfaces/settings.interface';

export type UserEntity = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phoneNumber: string;
  password: string;
  emailVerified: boolean;
  locale: string;
  dateOfBirth: string;
  country: string;
  bio: string;
  lastLogin: string;
  providerAccountId: string;
  deviceTokens: string[];
  provider: AUTH_PROVIDER;
  authType: AUTH_TYPE;
  status: USER_STATUS;
  gender: USER_GENDER;
  role: USER_ROLE;
  preference: PreferenceEntity;
};

export type UserFormData = {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: string;
  status: USER_STATUS;
};

export type UserFilter = BaseFilter;
export type UsersResponse = ResponseFormat<UserEntity[]>;
export type UserResponse = ResponseFormat<UserEntity>;
export type CreateUserResponse = ResponseFormat<{ email: string }>;
export type UserChangeAvatarResponse = ResponseFormat<{ avatar: string }>;
export type UpdateDeviceTokenResponse = ResponseFormat<UserEntity>;
