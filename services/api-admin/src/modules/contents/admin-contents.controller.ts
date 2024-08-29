import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { BulkDeleteDto } from '@/common/dtos/bulk-delete.dto';

import { ApiDocumentResponse } from '@/common/decorators/api-document-response.decorator';
import { PaginatedResponse } from '@/common/decorators/paginated-response.decorator';
import { Response } from '@/common/decorators/response.decorator';

import {
  BulkDeleteContentsSuccessDoc,
  CreateContentSuccessDoc,
  DeleteContentSuccessDoc,
  GetContentFailureDoc,
  UpdateContentSuccessDoc,
} from './docs/contents.doc';
import { CreateContentDto } from './dto/create-content.dto';
import { FilterContentDto } from './dto/filter-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { ContentsService } from './contents.service';

import { AccessTokenGuard } from '../auth/guards/access-token.guard';

@Controller('admin/contents')
@ApiTags('Admin Contents')
@UseGuards(AccessTokenGuard)
@ApiBearerAuth('accessToken')
export class AdminContentsController {
  constructor(private readonly contentsService: ContentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create content' })
  @ApiDocumentResponse({ status: HttpStatus.CREATED, message: 'Create content successfully', model: CreateContentSuccessDoc })
  @Response({ message: 'Create content successfully' })
  create(@Body() createContentDto: CreateContentDto) {
    return this.contentsService.create(createContentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get contents' })
  @ApiDocumentResponse({ message: 'Get contents successfully', model: CreateContentSuccessDoc })
  @PaginatedResponse({ message: 'Get contents successfully' })
  find(@Query() filterContentDto: FilterContentDto) {
    return this.contentsService.find(filterContentDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get content' })
  @ApiDocumentResponse({ message: 'Get content successfully', model: CreateContentSuccessDoc })
  @Response({ message: 'Get content successfully' })
  @ApiParam({ name: 'id', example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' })
  findOne(@Param('id') id: string) {
    return this.contentsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update content' })
  @ApiDocumentResponse({ message: 'Update content successfully', model: UpdateContentSuccessDoc })
  @Response({ message: 'Update content successfully' })
  @ApiParam({ name: 'id', example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' })
  update(@Param('id') id: string, @Body() updateContentDto: UpdateContentDto) {
    return this.contentsService.update(id, updateContentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete content' })
  @ApiDocumentResponse({ message: 'Delete content successfully', model: DeleteContentSuccessDoc })
  @ApiDocumentResponse({ status: HttpStatus.NOT_FOUND, message: 'Content not found', model: GetContentFailureDoc })
  @Response({ message: 'Delete content successfully' })
  @ApiParam({ name: 'id', example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' })
  remove(@Param('id') id: string) {
    return this.contentsService.remove(id);
  }

  @Post('bulk-delete')
  @ApiOperation({ summary: 'Delete multiple contents' })
  @ApiDocumentResponse({ message: 'Delete contents successfully', model: BulkDeleteContentsSuccessDoc })
  @Response({ message: 'Delete contents successfully' })
  bulkDelete(@Body() bulkDeleteContentDto: BulkDeleteDto) {
    return this.contentsService.bulkDelete(bulkDeleteContentDto);
  }
}
