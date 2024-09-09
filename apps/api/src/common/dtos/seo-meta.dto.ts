import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

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

  @ApiPropertyOptional({ example: 'seo,keywords,post' })
  @IsString()
  @IsOptional()
  @MaxLength(150)
  keywords?: string;
}
