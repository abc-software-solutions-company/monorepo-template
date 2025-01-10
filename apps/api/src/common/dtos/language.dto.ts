/*
 * @Author: <Tin Tran> (tin.tran@abcdigital.io)
 * @Created: 2025-01-10 09:20:10
 */

import { IsString, MaxLength } from 'class-validator';

export function createTranslationDto(maxLength: number) {
  class TranslationDto {
    @IsString()
    @MaxLength(255)
    lang: string;

    @IsString()
    @MaxLength(maxLength)
    value: string;
  }

  return TranslationDto;
}
