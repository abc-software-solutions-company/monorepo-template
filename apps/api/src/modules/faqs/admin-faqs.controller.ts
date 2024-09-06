import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { BulkDeleteDto } from '@/common/dtos/bulk-delete.dto';

import { ApiDocumentResponse } from '@/common/decorators/api-document-response.decorator';
import { PaginatedResponse } from '@/common/decorators/paginated-response.decorator';
import { Response } from '@/common/decorators/response.decorator';

import { BulkDeleteFaqsSuccessDoc, CreateFaqSuccessDoc, DeleteFaqSuccessDoc, GetFaqFailureDoc, UpdateFaqSuccessDoc } from './docs/faqs.doc';
import { CreateFaqDto } from './dto/create-faq.dto';
import { FilterFaqDto } from './dto/filter-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { FaqsService } from './faqs.service';

import { AccessTokenGuard } from '../auth/guards/access-token.guard';

@Controller('admin/faqs')
@ApiTags('Admin Faqs')
@UseGuards(AccessTokenGuard)
@ApiBearerAuth('accessToken')
export class AdminFaqsController {
  constructor(private readonly faqsService: FaqsService) {}

  @Post()
  @ApiOperation({ summary: 'Create faq' })
  @ApiDocumentResponse({ status: HttpStatus.CREATED, message: 'Create faq successfully', model: CreateFaqSuccessDoc })
  @Response({ message: 'Create faq successfully' })
  create(@Body() createFaqDto: CreateFaqDto) {
    return this.faqsService.create(createFaqDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get faqs' })
  @ApiDocumentResponse({ message: 'Get faqs successfully', model: CreateFaqSuccessDoc })
  @PaginatedResponse({ message: 'Get faqs successfully' })
  find(@Query() filterFaqDto: FilterFaqDto) {
    return this.faqsService.find(filterFaqDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get faq' })
  @ApiDocumentResponse({ message: 'Get faq successfully', model: CreateFaqSuccessDoc })
  @Response({ message: 'Get faq successfully' })
  @ApiParam({ name: 'id', example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' })
  findOne(@Param('id') id: string) {
    return this.faqsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update faq' })
  @ApiDocumentResponse({ message: 'Update faq successfully', model: UpdateFaqSuccessDoc })
  @Response({ message: 'Update faq successfully' })
  @ApiParam({ name: 'id', example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' })
  update(@Param('id') id: string, @Body() updateFaqDto: UpdateFaqDto) {
    return this.faqsService.update(id, updateFaqDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete faq' })
  @ApiDocumentResponse({ message: 'Delete faq successfully', model: DeleteFaqSuccessDoc })
  @ApiDocumentResponse({ status: HttpStatus.NOT_FOUND, message: 'Faq not found', model: GetFaqFailureDoc })
  @Response({ message: 'Delete faq successfully' })
  @ApiParam({ name: 'id', example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' })
  remove(@Param('id') id: string) {
    return this.faqsService.remove(id);
  }

  @Post('bulk-delete')
  @ApiOperation({ summary: 'Delete multiple faqs' })
  @ApiDocumentResponse({ message: 'Delete faqs successfully', model: BulkDeleteFaqsSuccessDoc })
  @Response({ message: 'Delete faqs successfully' })
  bulkDelete(@Body() bulkDeleteFaqDto: BulkDeleteDto) {
    return this.faqsService.bulkDelete(bulkDeleteFaqDto);
  }
}
