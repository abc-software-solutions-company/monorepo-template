import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, ValidateIf, ValidateNested } from 'class-validator';

import { createTranslationDto } from '@/common/dtos/language.dto';
import { SeoMetaDto } from '@/common/dtos/seo-meta.dto';

import { Translation } from '@/common/interfaces/language.interface';

import { toSlug } from '@/common/utils/string.util';

import { FileDto } from '@/modules/files/dto/file.dto';
import { File } from '@/modules/files/entities/file.entity';

import { CATEGORY_STATUS, CATEGORY_TYPE } from '../constants/categories.constant';

export class CreateCategoryDto {
  // TODO: Will be removed
  @ApiProperty({ example: 'Category Name' })
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

  @ApiProperty({ example: toSlug('Category Name') })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  slug: string;

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  description?: string;

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

  @IsString()
  @IsOptional()
  body?: string;

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

  @ApiPropertyOptional({ enum: CATEGORY_TYPE, example: CATEGORY_TYPE.POST })
  @IsEnum(CATEGORY_TYPE)
  @IsOptional()
  type?: CATEGORY_TYPE;

  @ApiPropertyOptional({ enum: CATEGORY_STATUS, example: CATEGORY_STATUS.VISIBLED })
  @IsEnum(CATEGORY_STATUS)
  @IsOptional()
  status?: CATEGORY_STATUS;

  @ValidateIf(obj => !!obj.parentId)
  @IsUUID()
  @IsOptional()
  parentId?: string;

  @ApiPropertyOptional({ type: SeoMetaDto, description: 'SEO Meta Data' })
  @IsOptional()
  @ValidateNested()
  @Type(() => SeoMetaDto)
  seoMeta?: SeoMetaDto;
}
