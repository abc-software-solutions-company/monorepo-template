import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional } from 'class-validator';

import { BaseFilterDto } from '@/common/dtos/base-filter.dto';

import { CONTENT_STATUS } from '../constants/contents.constant';

export class FilterContentDto extends BaseFilterDto {
  @ApiPropertyOptional({
    enum: CONTENT_STATUS,
    isArray: true,
    example: [CONTENT_STATUS.PUBLISHED, CONTENT_STATUS.DRAFT, CONTENT_STATUS.DELETED],
    default: [CONTENT_STATUS.PUBLISHED],
  })
  @IsArray()
  @IsEnum(CONTENT_STATUS, { each: true })
  @IsOptional()
  status?: CONTENT_STATUS[];
}
