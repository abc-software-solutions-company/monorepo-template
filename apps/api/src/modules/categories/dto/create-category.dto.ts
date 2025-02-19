import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDate, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, ValidateIf, ValidateNested } from 'class-validator';

import { TranslationDto } from '@/common/dtos/translation.dto';

import { toSlug } from '@/common/utils/string.util';

import { FileDto } from '@/modules/files/dto/file.dto';
import { File } from '@/modules/files/entities/file.entity';

import { CATEGORY_STATUS, CATEGORY_TYPE } from '../constants/categories.constant';

export class CreateCategoryDto extends TranslationDto {
  @ApiProperty({ example: toSlug('Category Name') })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  slug: string;

  @ApiPropertyOptional({ enum: CATEGORY_TYPE, example: CATEGORY_TYPE.NEWS })
  @IsEnum(CATEGORY_TYPE)
  @IsOptional()
  type?: CATEGORY_TYPE;

  @ApiProperty({ example: toSlug('https://example.com') })
  @IsString()
  @IsOptional()
  @MaxLength(2048)
  externalUrl?: string;

  @ApiPropertyOptional({ enum: CATEGORY_STATUS, example: CATEGORY_STATUS.PUBLISHED })
  @IsEnum(CATEGORY_STATUS)
  @IsOptional()
  status?: CATEGORY_STATUS;

  @ApiPropertyOptional({
    description: 'Array of file ID',
    example: [{ id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' }, { id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' }],
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => FileDto)
  images?: File[];

  @ValidateIf(obj => !!obj.parentId)
  @IsUUID()
  @IsOptional()
  parentId?: string;

  @ApiPropertyOptional({ description: 'Publish date', example: new Date() })
  @IsOptional()
  @IsDate()
  publishDate?: Date;
}
