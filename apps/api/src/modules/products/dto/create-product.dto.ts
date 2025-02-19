import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDate, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, Validate, ValidateNested } from 'class-validator';

import { TranslationDto } from '@/common/dtos/translation.dto';

import { toSlug } from '@/common/utils/string.util';

import { IsUUIDOrEmpty } from '@/common/validators/is-uuid-or-emptystring.validator';

import { FileDto } from '@/modules/files/dto/file.dto';
import { File } from '@/modules/files/entities/file.entity';

import { PRODUCT_STATUS, PRODUCT_TYPE } from '../constants/products.constant';

export class CreateProductDto extends TranslationDto {
  @ApiProperty({ example: toSlug('Name') })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  slug: string;

  @ApiPropertyOptional({ example: PRODUCT_TYPE.DEFAULT })
  @IsEnum(PRODUCT_TYPE)
  @IsOptional()
  type?: PRODUCT_TYPE;

  @ApiProperty({ example: toSlug('https://example.com') })
  @IsString()
  @IsOptional()
  @MaxLength(2048)
  externalUrl?: string;

  @ApiPropertyOptional({ example: PRODUCT_STATUS.DRAFT })
  @IsEnum(PRODUCT_STATUS)
  @IsOptional()
  status: PRODUCT_STATUS;

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
  @Validate(IsUUIDOrEmpty)
  categoryId?: string;

  @ApiPropertyOptional({ description: 'Publish date', example: new Date() })
  @IsOptional()
  @IsDate()
  publishDate?: Date;
}
