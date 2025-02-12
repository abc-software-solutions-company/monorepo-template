import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

import { BaseFilterDto } from '@/common/dtos/base-filter.dto';

import { POST_STATUS, POST_TYPE } from '../constants/posts.constant';

export class FilterPostDto extends BaseFilterDto {
  @ApiPropertyOptional({ enum: POST_TYPE, default: POST_TYPE.NEWS })
  @IsEnum(POST_TYPE)
  @IsOptional()
  type?: POST_TYPE;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  year?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  categoryId?: string;

  @ApiPropertyOptional({
    enum: POST_STATUS,
    isArray: true,
    example: [POST_STATUS.DRAFT, POST_STATUS.PUBLISHED],
    default: [POST_STATUS.DRAFT],
  })
  @IsArray()
  @IsEnum(POST_STATUS, { each: true })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  status?: POST_STATUS[];
}
