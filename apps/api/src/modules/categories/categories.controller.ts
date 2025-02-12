import { Controller, Get, HttpStatus, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { ApiDocumentResponse } from '@/common/decorators/api-document-response.decorator';
import { PaginatedResponse } from '@/common/decorators/paginated-response.decorator';
import { Response } from '@/common/decorators/response.decorator';

import { CATEGORY_TYPE } from './constants/categories.constant';
import { GetCategoriesSuccessDoc, GetCategoryFailureDoc, GetCategorySuccessDoc } from './docs/categories.doc';
import { FilterCategoryDto } from './dto/filter-category.dto';
import { CategoriesService } from './categories.service';

@Controller('categories')
@ApiTags('Categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Get categories' })
  @ApiDocumentResponse({ status: HttpStatus.OK, message: 'Get categories successfully', model: GetCategoriesSuccessDoc })
  @PaginatedResponse({ message: 'Get categories successfully' })
  find(@Query() filterDto: FilterCategoryDto) {
    return this.categoriesService.find(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category' })
  @ApiDocumentResponse({ status: HttpStatus.OK, message: 'Get category successfully', model: GetCategorySuccessDoc })
  @ApiDocumentResponse({ status: HttpStatus.NOT_FOUND, message: 'Category not found', model: GetCategoryFailureDoc })
  @Response({ status: HttpStatus.OK, message: 'Get category successfully' })
  @ApiParam({ name: 'id', description: 'UUID', example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' })
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Get('.by.parent.id/:id')
  @ApiOperation({ summary: 'Get categories by parent ID' })
  @ApiDocumentResponse({ status: HttpStatus.OK, message: 'Get categories successfully', model: GetCategoriesSuccessDoc })
  @Response({ status: HttpStatus.OK, message: 'Get categories successfully' })
  @ApiParam({ name: 'id', description: 'UUID', example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' })
  findByParentId(@Param('id') id: string) {
    return this.categoriesService.findByParentId(id);
  }

  @Get('.by.type/:type')
  @ApiOperation({ summary: 'Get categories by type' })
  @ApiDocumentResponse({ status: HttpStatus.OK, message: 'Get categories successfully', model: GetCategoriesSuccessDoc })
  @Response({ status: HttpStatus.OK, message: 'Get categories successfully' })
  @ApiParam({ name: 'type', description: 'Category Type', example: 'news' })
  findByType(@Param('type') type: CATEGORY_TYPE) {
    return this.categoriesService.findByType(type);
  }

  @Get('.by.slug/:slug')
  @ApiOperation({ summary: 'Get category by slug' })
  @ApiDocumentResponse({ status: HttpStatus.OK, message: 'Get category successfully', model: GetCategorySuccessDoc })
  @Response({ status: HttpStatus.OK, message: 'Get category successfully' })
  @ApiParam({ name: 'slug', example: 'this-is-title-of-category' })
  findBySlug(@Param('slug') slug: string) {
    return this.categoriesService.findBySlug(slug);
  }
}
