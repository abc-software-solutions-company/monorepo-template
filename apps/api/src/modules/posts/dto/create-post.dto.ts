import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDate, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min, Validate, ValidateNested } from 'class-validator';

import { TranslationDto } from '@/common/dtos/translation.dto';

import { toSlug } from '@/common/utils/string.util';

import { IsUUIDOrEmpty } from '@/common/validators/is-uuid-or-emptystring.validator';

import { FileDto } from '@/modules/files/dto/file.dto';
import { File } from '@/modules/files/entities/file.entity';

import { POST_STATUS, POST_TYPE } from '../constants/posts.constant';

export class CreatePostDto extends TranslationDto {
  @ApiProperty({ example: toSlug('Post Name') })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  slug: string;

  @ApiPropertyOptional({ enum: POST_TYPE, example: POST_TYPE.NEWS })
  @IsEnum(POST_TYPE)
  @IsOptional()
  type?: POST_TYPE;

  @ApiProperty({ example: toSlug('https://example.com') })
  @IsString()
  @IsOptional()
  @MaxLength(2048)
  externalUrl?: string;

  @ApiPropertyOptional({ enum: POST_STATUS, example: POST_STATUS.DRAFT })
  @IsEnum(POST_STATUS)
  @IsOptional()
  status?: POST_STATUS;

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

  @ApiPropertyOptional({ description: 'Post order', example: 0, default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;

  @ApiPropertyOptional({ description: 'Publish date', example: new Date() })
  @IsOptional()
  @IsDate()
  publishDate?: Date;
}
