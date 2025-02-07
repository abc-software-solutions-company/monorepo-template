import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';

import { BaseFilterDto } from '@/common/dtos/base-filter.dto';

import { PRODUCT_STATUS, PRODUCT_TYPE } from '../constants/products.constant';

export class FilterProductDto extends BaseFilterDto {
  @ApiPropertyOptional({ enum: PRODUCT_TYPE, default: PRODUCT_TYPE.DEFAULT })
  @IsEnum(PRODUCT_TYPE)
  @IsOptional()
  type?: PRODUCT_TYPE;

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
