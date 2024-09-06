import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional } from 'class-validator';

import { BaseFilterDto } from '@/common/dtos/base-filter.dto';

import { FAQ_STATUS } from '../constants/faqs.constant';

export class FilterFaqDto extends BaseFilterDto {
  @ApiPropertyOptional({
    enum: FAQ_STATUS,
    isArray: true,
    example: [FAQ_STATUS.PUBLISHED, FAQ_STATUS.DRAFT, FAQ_STATUS.DELETED],
    default: [FAQ_STATUS.PUBLISHED],
  })
  @IsArray()
  @IsEnum(FAQ_STATUS, { each: true })
  @IsOptional()
  status?: FAQ_STATUS[];
}
