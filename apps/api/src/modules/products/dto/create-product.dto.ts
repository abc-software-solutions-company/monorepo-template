import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, ValidateNested } from 'class-validator';

import { createTranslationDto } from '@/common/dtos/language.dto';
import { SeoMetaDto } from '@/common/dtos/seo-meta.dto';

import { Translation } from '@/common/interfaces/language.interface';

import { toSlug } from '@/common/utils/string.util';

import { FileDto } from '@/modules/files/dto/file.dto';
import { File } from '@/modules/files/entities/file.entity';

import { PRODUCT_STATUS } from '../constants/products.constant';

export class CreateProductDto {
  // TODO: Will be removed
  @ApiProperty({ example: 'Product Name' })
  @IsOptional()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({
    description: 'Post name multi-language',
    example: [
      { lang: 'en-us', value: 'Title' },
      { lang: 'vi-vn', value: 'Tiêu đề' },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => createTranslationDto(255))
  nameLocalized?: Translation[];

  @ApiProperty({ example: toSlug('Product Name') })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  slug: string;

  @ApiPropertyOptional({ example: '<p>description</p>' })
  @IsString()
  @IsOptional()
  @MaxLength(2000)
  description: string;

  @ApiPropertyOptional({
    description: 'Post description multi-language',
    example: [
      { lang: 'en-us', value: 'Short description' },
      { lang: 'vi-vn', value: 'Nội dung ngắn' },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => createTranslationDto(2000))
  descriptionLocalized?: Translation[];

  @ApiPropertyOptional({ example: '<p>body</p>' })
  @IsString()
  @IsOptional()
  body: string;

  @ApiPropertyOptional({
    description: 'Post body multi-language',
    example: [
      { lang: 'en-us', value: 'Content' },
      { lang: 'vi-vn', value: 'Nội dung' },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => createTranslationDto(Infinity))
  bodyLocalized?: Translation[];

  @ApiPropertyOptional({ example: PRODUCT_STATUS.DRAFT })
  @IsEnum(PRODUCT_STATUS)
  @IsOptional()
  status: PRODUCT_STATUS;

  @ApiPropertyOptional({ description: 'File ID', example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  cover?: string;

  @ApiPropertyOptional({
    description: 'Cover image multi-language',
    example: [
      { lang: 'en-us', value: 'sample-en.jpg' },
      { lang: 'vi-vn', value: 'sample-vi.jpg' },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => createTranslationDto(1000))
  coverLocalized?: Translation[];

  @ApiPropertyOptional({
    description: 'Array of file ID',
    example: [{ id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' }, { id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' }],
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => FileDto)
  images?: File[];

  @ApiPropertyOptional({ description: 'Category ID', example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' })
  @IsOptional()
  @IsUUID('4')
  categoryId?: string;

  @ApiPropertyOptional({ type: SeoMetaDto, description: 'SEO Meta Data' })
  @IsOptional()
  @ValidateNested()
  @Type(() => SeoMetaDto)
  seoMeta?: SeoMetaDto;
}
