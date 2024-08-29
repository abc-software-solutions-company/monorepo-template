import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

import { FAQ_STATUS } from '../constants/faqs.constant';

export class CreateFaqDto {
  @ApiProperty({ example: 'What is Lorem Ipsum?' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiProperty({ example: 'Lorem ipsum dolor sit amet. consectetur adipisicing elit. sed do eiusmod tempor.' })
  @IsString()
  @MaxLength(2000)
  content: string;

  @ApiPropertyOptional({ example: FAQ_STATUS.DRAFT })
  @IsString()
  @IsOptional()
  status?: FAQ_STATUS;
}
