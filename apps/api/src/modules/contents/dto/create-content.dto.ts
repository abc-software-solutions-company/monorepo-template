import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';

import { SeoMetaDto } from '@/common/dtos/seo-meta.dto';

import { toSlug } from '@/common/utils/string.util';

import { CONTENT_STATUS, CONTENT_TYPE } from '../constants/contents.constant';

export class CreateContentDto {
  @ApiProperty({ example: 'This is title' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

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

  @ApiPropertyOptional({ example: '<p>body</p>' })
  @IsString()
  @IsOptional()
  body: string;

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
