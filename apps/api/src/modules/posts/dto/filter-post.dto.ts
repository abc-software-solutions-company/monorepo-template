import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';

import { BaseFilterDto } from '@/common/dtos/base-filter.dto';

import { POST_STATUS } from '../constants/posts.constant';

export class FilterPostDto extends BaseFilterDto {
  @ApiProperty()
  @IsString()
  type: string;

  @ApiPropertyOptional({
    enum: POST_STATUS,
    isArray: true,
    example: [POST_STATUS.DRAFT],
    default: [POST_STATUS.DRAFT],
  })
  @IsArray()
  @IsEnum(POST_STATUS, { each: true })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  status?: POST_STATUS[];
}
