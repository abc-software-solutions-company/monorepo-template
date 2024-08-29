import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { USER_GENDER, USER_ROLE, USER_STATUS } from '@/modules/users/constants/users.constant';

import { AUTH_PROVIDER, AUTH_TYPE } from '../constants/auth.constant';

export class SignUpDoc {
  @ApiProperty({ enum: HttpStatus, example: HttpStatus.OK })
  statusCode: HttpStatus;

  @ApiProperty({ type: String, example: 'Create account successfully' })
  message: string;

  @ApiProperty({
    type: 'object',
    example: {
      name: 'My Name',
      email: 'ammodesk@gmail.com',
      avatar: '',
      phoneNumber: '',
      emailVerified: false,
      locale: '',
      providerAccountId: '',
      provider: AUTH_PROVIDER.CREDENTIALS,
      authType: AUTH_TYPE.CREDENTIALS,
      gender: USER_GENDER.OTHER,
      status: USER_STATUS.ACTIVE,
      role: USER_ROLE.ADMIN,
      updatedAt: '2023-12-05T23:44:49.288Z',
      lastLogin: null,
      id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      createdAt: '2023-12-05T23:44:49.288Z',
    },
  })
  data: unknown;
}

export class LoginWithCredentialsDoc {
  @ApiProperty({ enum: HttpStatus, example: HttpStatus.OK })
  statusCode: HttpStatus;

  @ApiProperty({ type: String, example: 'Login successfully' })
  message: string;

  @ApiProperty({
    type: 'object',
    example: {
      user: {
        id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
        email: 'ammodesk@gmail.com',
        name: 'My Name',
        avatar: null,
        role: USER_ROLE.SUPER_ADMIN,
        preference: {
          language: 'en-us',
          theme: 'dark',
          id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
        },
      },
      accessToken: '<TOKEN>',
    },
  })
  data: unknown;
}

export class LoginWithAppleDoc {
  @ApiProperty({ enum: HttpStatus, example: HttpStatus.OK })
  statusCode: HttpStatus;

  @ApiProperty({ type: String, example: 'Login successfully' })
  message: string;

  @ApiProperty({
    type: 'object',
    example: {
      user: {
        id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
        email: 'ammodesk@gmail.com',
        role: USER_ROLE.SUPER_ADMIN,
        name: 'My Name',
        avatar: '<AVATAR>',
        accessToken: '<TOKEN>',
      },
    },
  })
  data: unknown;
}

export class LoginWithFacebookDoc {
  @ApiProperty({ enum: HttpStatus, example: HttpStatus.OK })
  statusCode: HttpStatus;

  @ApiProperty({ type: String, example: 'Login successfully' })
  message: string;

  @ApiProperty({
    type: 'object',
    example: {
      user: {
        id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
        email: 'ammodesk@gmail.com',
        role: USER_ROLE.SUPER_ADMIN,
        name: 'My Name',
        avatar: '<AVATAR>',
        accessToken: '<TOKEN>',
      },
    },
  })
  data: unknown;
}

export class LoginWithGoogleDoc {
  @ApiProperty({ enum: HttpStatus, example: HttpStatus.OK })
  statusCode: HttpStatus;

  @ApiProperty({ type: String, example: 'Login successfully' })
  message: string;

  @ApiProperty({
    type: 'object',
    example: {
      user: {
        id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
        email: 'ammodesk@gmail.com',
        role: USER_ROLE.SUPER_ADMIN,
        name: 'My Name',
        avatar: '<AVATAR>',
        accessToken: '<TOKEN>',
      },
    },
  })
  data: unknown;
}

export class SignOutDoc {
  @ApiProperty({ enum: HttpStatus, example: HttpStatus.OK })
  statusCode: HttpStatus;

  @ApiProperty({ type: String, example: 'Logout successfully' })
  message: string;

  @ApiProperty({
    type: 'object',
    example: {
      status: 'success',
    },
  })
  data: unknown;
}

export class ResetPasswordDoc {
  @ApiProperty({ enum: HttpStatus, example: HttpStatus.OK })
  statusCode: HttpStatus;

  @ApiProperty({ type: String, example: 'Reset password successfully' })
  message: string;

  @ApiProperty({
    type: 'object',
    example: {
      code: '12345',
    },
  })
  data: unknown;
}

export class VerifyResetPasswordDoc {
  @ApiProperty({ enum: HttpStatus, example: HttpStatus.OK })
  statusCode: HttpStatus;

  @ApiProperty({ type: String, example: 'Verify reset password successfully' })
  message: string;

  @ApiProperty({
    type: 'object',
    example: {
      status: 'success',
    },
  })
  data: unknown;
}
