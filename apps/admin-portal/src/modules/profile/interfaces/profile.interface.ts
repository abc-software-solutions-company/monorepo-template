import { ResponseFormat } from '@/interfaces/api-response.interface';

import { UserEntity } from '@/modules/users/interfaces/users.interface';

export type ProfileFormData = {
  name: string;
  phoneNumber: string;
  dateOfBirth?: Date;
  country: string;
  bio: string;
};

export type ProfileResponse = ResponseFormat<UserEntity>;
