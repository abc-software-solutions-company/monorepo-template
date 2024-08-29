import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { ApiDocumentResponse } from '@/common/decorators/api-document-response.decorator';
import { PaginatedResponse } from '@/common/decorators/paginated-response.decorator';
import { UUIDParam } from '@/common/decorators/param.decorator';
import { Response } from '@/common/decorators/response.decorator';

import { CreateAuditLogSuccessDoc, GetAuditLogsSuccessDoc, GetAuditLogSuccessDoc } from './docs/audit-logs.doc';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { FilterAuditLogDto } from './dto/filter-audit-log.dto';
import { AuditLogsService } from './audit-logs.service';

import { AccessTokenGuard } from '../auth/guards/access-token.guard';

@Controller('admin/audit-logs')
@ApiTags('Admin Audit Logs')
@UseGuards(AccessTokenGuard)
@ApiBearerAuth('accessToken')
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Post()
  @ApiOperation({ summary: 'Create audit log' })
  @ApiDocumentResponse({ message: 'Create audit log successfully', model: CreateAuditLogSuccessDoc })
  @Response({ message: 'Create audit log successfully' })
  create(@Body() createDto: CreateAuditLogDto) {
    return this.auditLogsService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get audit logs' })
  @ApiDocumentResponse({ message: 'Get audit logs successfully', model: GetAuditLogsSuccessDoc })
  @PaginatedResponse({ message: 'Get audit logs successfully' })
  find(@Query() filterDto: FilterAuditLogDto) {
    return this.auditLogsService.find(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get audit log' })
  @ApiDocumentResponse({ message: 'Get audit log successfully', model: GetAuditLogSuccessDoc })
  @Response({ message: 'Get audit log successfully' })
  @ApiParam({ name: 'id', example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' })
  findOne(@UUIDParam('id') id: string) {
    return this.auditLogsService.findOne(id);
  }
}
