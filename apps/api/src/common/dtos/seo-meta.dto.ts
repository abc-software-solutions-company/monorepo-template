import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';

import { createTranslationDto } from './language.dto';

import { Translation } from '../interfaces/language.interface';

export class SeoMetaDto {
  @ApiPropertyOptional({ example: 'SEO Title' })
  @IsString()
  @IsOptional()
  @MaxLength(60)
  title?: string;

  @ApiPropertyOptional({ example: 'SEO description goes here.' })
  @IsString()
  @IsOptional()
  @MaxLength(150)
  description?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => createTranslationDto(60))
  titleLocalized?: Translation[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => createTranslationDto(150))
  descriptionLocalized?: Translation[];

  @ApiPropertyOptional({ example: 'seo,keywords,post' })
  @IsString()
  @IsOptional()
  @MaxLength(150)
  keywords?: string;
}
