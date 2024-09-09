import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, ValidateNested } from 'class-validator';

import { SeoMetaDto } from '@/common/dtos/seo-meta.dto';

import { toSlug } from '@/common/utils/string.util';

import { FileDto } from '@/modules/files/dto/file.dto';
import { File } from '@/modules/files/entities/file.entity';

import { POST_STATUS } from '../constants/posts.constant';

export class CreatePostDto {
  @ApiProperty({ example: 'Post Name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: toSlug('Post Name') })
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

  @ApiPropertyOptional({ example: POST_STATUS.DRAFT })
  @IsEnum(POST_STATUS)
  @IsOptional()
  status: POST_STATUS;

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
