import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Length, Matches } from 'class-validator';

import { AUTH_AUTHENTICATOR } from '../constants/auth.constant';

export class SignInDto {
  @ApiProperty({ example: 'ammodesk@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Ammodesk123@' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\\[\]{};':"\\|,.<>\\/?])(?=.*[0-9]).{8,255}$/, {
    message: 'password should contain at least one uppercase letter, one lowercase letter, one number and one special character',
  })
  @Length(8, 255, { message: 'password has to be at between 8 and 255 characters' })
  password: string;
}

export class OAuthSignInDto {
  @ApiProperty({ example: '<TOKEN>' })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({ enum: AUTH_AUTHENTICATOR, default: AUTH_AUTHENTICATOR.SELF_HOSTED })
  @IsEnum(AUTH_AUTHENTICATOR)
  authenticator: AUTH_AUTHENTICATOR;
}

export class OAuthFacebookSignInDto extends OAuthSignInDto {
  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isFacebookLimited: boolean;
}
