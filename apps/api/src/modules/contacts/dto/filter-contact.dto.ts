import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional } from 'class-validator';

import { BaseFilterDto } from '@/common/dtos/base-filter.dto';

import { CONTACT_STATUS } from '../constants/contacts.constant';

export class FilterContactDto extends BaseFilterDto {
  @ApiPropertyOptional({
    enum: CONTACT_STATUS,
    isArray: true,
    example: [CONTACT_STATUS.PUBLISHED, CONTACT_STATUS.DELETED],
    default: [CONTACT_STATUS.PUBLISHED],
  })
  @IsArray()
  @IsEnum(CONTACT_STATUS, { each: true })
  @IsOptional()
  status?: CONTACT_STATUS[];
}
