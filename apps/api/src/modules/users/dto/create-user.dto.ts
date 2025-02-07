import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

import { AUTH_PROVIDER, AUTH_TYPE } from '@/modules/auth/constants/auth.constant';

import { USER_GENDER, USER_ROLE, USER_STATUS } from '../constants/users.constant';
import { UserPreference } from '../entities/user-preference.entity';

export class CreateUserDto {
  @ApiProperty({ example: 'My Name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @ApiProperty({ example: 'ammodesk@gmail.com' })
  @IsEmail()
  @MaxLength(320)
  email: string;

  @ApiPropertyOptional({ example: '' })
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiPropertyOptional({ example: '' })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiPropertyOptional({ example: '<PASSWORD>' })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  emailVerified?: boolean;

  @ApiPropertyOptional({ example: '' })
  @IsString()
  @IsOptional()
  locale?: string;

  @ApiPropertyOptional({ example: '' })
  @IsString()
  @IsOptional()
  providerAccountId?: string;

  @ApiPropertyOptional({ example: '' })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiPropertyOptional({ example: '' })
  @IsDate()
  @IsOptional()
  dateOfBirth?: Date;

  @ApiPropertyOptional({ example: '' })
  @IsString()
  @IsOptional()
  @MaxLength(2000)
  bio?: string;

  @ApiPropertyOptional({ example: AUTH_PROVIDER.CREDENTIALS })
  @IsEnum(AUTH_PROVIDER)
  @IsOptional()
  provider?: AUTH_PROVIDER;

  @ApiPropertyOptional({ example: AUTH_TYPE.CREDENTIALS })
  @IsEnum(AUTH_TYPE)
  @IsOptional()
  authType?: AUTH_TYPE;

  @ApiPropertyOptional({ enum: USER_GENDER, example: USER_GENDER.OTHER })
  @IsEnum(USER_GENDER)
  @IsOptional()
  gender?: USER_GENDER;

  @ApiPropertyOptional({ enum: USER_STATUS, example: USER_STATUS.INACTIVE })
  @IsEnum(USER_STATUS)
  @IsOptional()
  status: USER_STATUS;

  @ApiProperty({ enum: USER_ROLE, example: USER_ROLE.USER })
  @IsEnum(USER_ROLE)
  @IsOptional()
  role: USER_ROLE;

  @IsOptional()
  preference?: UserPreference;

  @IsOptional()
  deviceToken?: string;
}
