/*
 * @Author: <Tin Tran> (tin.tran@abcdigital.io)
 * @Created: 2025-01-14 14:32:18
 */

import { LANGUAGES } from '../constants/language.constant';
import { Language } from '../interfaces/language.interface';

export const getLanguages = (locale: string): Language[] => {
  return LANGUAGES.map(language => ({ ...language, isDefault: language.code === locale })).sort((a, b) => (a.isDefault ? -1 : b.isDefault ? 1 : 0));
};
