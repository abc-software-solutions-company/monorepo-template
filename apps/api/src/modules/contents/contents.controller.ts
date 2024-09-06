import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { ApiDocumentResponse } from '@/common/decorators/api-document-response.decorator';
import { Response } from '@/common/decorators/response.decorator';

import { CreateContentSuccessDoc, GetContentsSuccessDoc } from './docs/contents.doc';
import { CreateContentDto } from './dto/create-content.dto';
import { ContentsService } from './contents.service';

@Controller('contents')
@ApiTags('Contents')
export class ContentsController {
  constructor(private readonly contentsService: ContentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create content' })
  @ApiDocumentResponse({ status: HttpStatus.CREATED, message: 'Create content successfully', model: CreateContentSuccessDoc })
  @Response({ message: 'Create content successfully' })
  create(@Body() createContentDto: CreateContentDto) {
    return this.contentsService.create(createContentDto);
  }

  @Get('.by.slug/:slug')
  @ApiOperation({ summary: 'Get content by slug' })
  @ApiDocumentResponse({ message: 'Get content successfully', model: GetContentsSuccessDoc })
  @Response({ message: 'Get content successfully' })
  @ApiParam({ name: 'slug', example: 'this-is-title' })
  findBySlug(@Param('slug') slug: string) {
    return this.contentsService.findBySlug(slug);
  }
}
