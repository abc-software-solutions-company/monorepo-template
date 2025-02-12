import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { ApiDocumentResponse } from '@/common/decorators/api-document-response.decorator';
import { PaginatedResponse } from '@/common/decorators/paginated-response.decorator';
import { Response } from '@/common/decorators/response.decorator';

import { PRODUCT_STATUS } from './constants/products.constant';
import { GetProductsSuccessDoc, GetProductSuccessDoc } from './docs/products.doc';
import { FilterProductDto } from './dto/filter-product.dto';
import { ProductsService } from './products.service';

@Controller('products')
@ApiTags('Products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Get products' })
  @ApiDocumentResponse({ message: 'Get products successfully', model: GetProductsSuccessDoc })
  @PaginatedResponse({ message: 'Get products successfully' })
  find(@Query() filterDto: FilterProductDto) {
    filterDto.status = [PRODUCT_STATUS.PUBLISHED];

    return this.productsService.find(filterDto);
  }

  @Get('.by.slug/:slug')
  @ApiOperation({ summary: 'Get product by slug' })
  @ApiDocumentResponse({ message: 'Get product successfully', model: GetProductSuccessDoc })
  @Response({ message: 'Get product successfully' })
  @ApiParam({ name: 'slug', example: 'this-is-title-of-product' })
  findBySlug(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }
}
