import { createEntityField } from '@/common/utils/entity-field.util';

import { User } from '../entities/user.entity';

const userFeilds = createEntityField(User, {
  fields: ['id', 'name', 'email', 'phoneNumber', 'lastLogin', 'dateOfBirth', 'country', 'bio', 'role', 'status', 'gender', 'createdAt'],
  alias: 'user',
});

export const USER_GET_FIELDS = [...userFeilds].flat().flatMap(item => item.trim().split(/\s+/));

export const USER_FIELDS_TO_CREATE_OR_UPDATE: (keyof User)[] = [
  'name',
  'email',
  'avatar',
  'phoneNumber',
  'country',
  'dateOfBirth',
  'bio',
  'gender',
  'status',
  'role',
];

export enum USER_GENDER {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export enum USER_ROLE {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  USER = 'user',
}

export enum USER_STATUS {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DELETED = 'deleted',
  BLOCKED = 'blocked',
  NOT_VERIFIED = 'not_verified',
}
