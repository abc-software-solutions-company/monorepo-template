/*
 * @Author: <Tin Tran> (tin.tran@abcdigital.io)
 * @Created: 2025-01-17 19:15:32
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';

import { createTranslationDto } from './language.dto';
import { SeoMetaDto } from './seo-meta.dto';

import { Translation } from '../interfaces/language.interface';

export class TranslationDto {
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
    description: 'Name multi-language',
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

  @ApiPropertyOptional({
    description: 'Description multi-language',
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

  @ApiPropertyOptional({
    description: 'Body multi-language',
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

  @ApiPropertyOptional({ type: SeoMetaDto, description: 'SEO Meta Data' })
  @IsOptional()
  @ValidateNested()
  @Type(() => SeoMetaDto)
  seoMeta?: SeoMetaDto;
}
