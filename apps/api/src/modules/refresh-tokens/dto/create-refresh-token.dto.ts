import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { User } from '@/modules/users/entities/user.entity';

export class CreateRefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsOptional()
  createdByIp?: string;

  @IsString()
  @IsOptional()
  revokedByIp?: string;

  @IsDate()
  @IsOptional()
  revokedAt?: Date;

  @IsString()
  @IsNotEmpty()
  userAgent: string;

  user: User;
}
