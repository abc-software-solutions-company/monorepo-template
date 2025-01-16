import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';

import { createTranslationDto } from '@/common/dtos/language.dto';

import { Translation } from '@/common/interfaces/language.interface';

import { FAQ_STATUS } from '../constants/faqs.constant';

export class CreateFaqDto {
  // TODO: Will be removed
  @ApiProperty({ example: 'What is Lorem Ipsum?' })
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(255)
  title?: string;

  @ApiProperty({ example: 'Lorem ipsum dolor sit amet. consectetur adipisicing elit. sed do eiusmod tempor.' })
  @IsString()
  @IsOptional()
  @MaxLength(2000)
  content?: string;

  @ApiPropertyOptional({
    description: 'Content of FAQ',
    example: [
      { lang: 'en-us', value: 'FAQ Content' },
      { lang: 'vi-vn', value: 'Nội dung của FAQ' },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => createTranslationDto(2000))
  contentLocalized?: Translation[];

  @ApiPropertyOptional({
    description: 'Title of FAQ',
    example: [
      { lang: 'en-us', value: 'FAQ Title' },
      { lang: 'vi-vn', value: 'Tiêu đề của FAQ' },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => createTranslationDto(255))
  titleLocalized?: Translation[];

  @ApiPropertyOptional({ example: FAQ_STATUS.DRAFT })
  @IsString()
  @IsOptional()
  status?: FAQ_STATUS;
}
