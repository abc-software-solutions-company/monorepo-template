import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';

import { createTranslationDto } from '@/common/dtos/language.dto';
import { SeoMetaDto } from '@/common/dtos/seo-meta.dto';

import { Translation } from '@/common/interfaces/language.interface';

import { toSlug } from '@/common/utils/string.util';

import { CONTENT_STATUS, CONTENT_TYPE } from '../constants/contents.constant';

export class CreateContentDto {
  // TODO: Will be removed
  @ApiProperty({ example: 'This is title' })
  @IsString()
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

  @ApiProperty({ example: toSlug('This is title') })
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

  @ApiPropertyOptional({ example: CONTENT_TYPE.UNCATEGORIZED })
  @IsString()
  @IsOptional()
  type?: CONTENT_TYPE;

  @ApiPropertyOptional({ example: CONTENT_STATUS.DRAFT })
  @IsString()
  @IsOptional()
  status?: CONTENT_STATUS;

  @ApiPropertyOptional({ type: SeoMetaDto, description: 'SEO Meta Data' })
  @IsOptional()
  @ValidateNested()
  @Type(() => SeoMetaDto)
  seoMeta?: SeoMetaDto;
}
