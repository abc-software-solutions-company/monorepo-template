import { User } from '../entities/user.entity';

export const USER_GET_FIELDS = [
  [
    'user.id user.avatar user.name user.email user.phoneNumber user.lastLogin user.dateOfBirth user.country user.bio user.role user.status user.gender user.createdAt',
  ],
]
  .flat()
  .flatMap(item => item.trim().split(/\s+/));

export const USER_FIELDS_TO_CREATE_OR_UPDATE = [
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
] as (keyof User)[];

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
