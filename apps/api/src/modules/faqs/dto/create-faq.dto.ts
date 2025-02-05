import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';

import { createTranslationDto } from '@/common/dtos/language.dto';

import { Translation } from '@/common/interfaces/language.interface';

import { FAQ_STATUS } from '../constants/faqs.constant';

export class CreateFaqDto {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => createTranslationDto(255))
  titleLocalized?: Translation[];

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
  @Type(() => createTranslationDto(5000))
  descriptionLocalized?: Translation[];

  @ApiPropertyOptional({ example: FAQ_STATUS.DRAFT })
  @IsString()
  @IsOptional()
  status?: FAQ_STATUS;
}
