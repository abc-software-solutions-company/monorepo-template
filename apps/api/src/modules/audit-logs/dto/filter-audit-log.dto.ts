import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { BaseFilterDto } from '@/common/dtos/base-filter.dto';

import { AUDIT_LOG_HTTP_METHOD, AUDIT_LOG_TABLE_NAME } from '../constants/audit-logs.constant';

export class FilterAuditLogDto extends BaseFilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  email: string;

  @ApiPropertyOptional({ enum: AUDIT_LOG_TABLE_NAME })
  @IsOptional()
  @IsEnum(AUDIT_LOG_TABLE_NAME)
  tableName: AUDIT_LOG_TABLE_NAME;

  @ApiPropertyOptional({ enum: AUDIT_LOG_HTTP_METHOD })
  @IsOptional()
  @IsEnum(AUDIT_LOG_HTTP_METHOD)
  action: AUDIT_LOG_HTTP_METHOD;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  recordId: string;
}
