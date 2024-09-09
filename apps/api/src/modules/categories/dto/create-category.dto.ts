import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, ValidateIf, ValidateNested } from 'class-validator';

import { SeoMetaDto } from '@/common/dtos/seo-meta.dto';

import { toSlug } from '@/common/utils/string.util';

import { FileDto } from '@/modules/files/dto/file.dto';
import { File } from '@/modules/files/entities/file.entity';

import { CATEGORY_STATUS, CATEGORY_TYPE } from '../constants/categories.constant';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Category Name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: toSlug('Category Name') })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  slug: string;

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  description?: string;

  @IsString()
  @IsOptional()
  body?: string;

  @ApiPropertyOptional({ description: 'File ID', example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  cover?: string;

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
