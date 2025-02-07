import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';

import { BaseFilterDto } from '@/common/dtos/base-filter.dto';

import { PRODUCT_STATUS } from '../constants/products.constant';

export class FilterProductDto extends BaseFilterDto {
  @ApiProperty()
  @IsString()
  type: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  categoryId?: string;

  @ApiPropertyOptional({
    enum: PRODUCT_STATUS,
    isArray: true,
    example: [PRODUCT_STATUS.DRAFT, PRODUCT_STATUS.PUBLISHED],
    default: [PRODUCT_STATUS.DRAFT],
  })
  @IsArray()
  @IsEnum(PRODUCT_STATUS, { each: true })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  status?: PRODUCT_STATUS[];
}
