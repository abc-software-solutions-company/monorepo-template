import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsUUID } from 'class-validator';

import { BaseFilterDto } from '@/common/dtos/base-filter.dto';

import { CATEGORY_STATUS, CATEGORY_TYPE } from '../constants/categories.constant';

export class FilterCategoryDto extends BaseFilterDto {
  @ApiPropertyOptional({ enum: CATEGORY_TYPE, default: CATEGORY_TYPE.NEWS })
  @IsEnum(CATEGORY_TYPE)
  @IsOptional()
  type?: CATEGORY_TYPE;

  @ApiPropertyOptional({
    enum: CATEGORY_STATUS,
    isArray: true,
    example: [CATEGORY_STATUS.PUBLISHED, CATEGORY_STATUS.DELETED],
    default: [CATEGORY_STATUS.PUBLISHED],
  })
  @IsArray()
  @IsEnum(CATEGORY_STATUS, { each: true })
  @IsOptional()
  status?: CATEGORY_STATUS[];

  @IsOptional()
  parentId?: string;

  @ApiPropertyOptional({ description: 'Category ID', example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' })
  @IsOptional()
  @IsUUID('4')
  excludeId?: string;
}
