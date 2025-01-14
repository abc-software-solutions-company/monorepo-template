/*
 * @Author: <Tin Tran> (tin.tran@abcdigital.io)
 * @Created: 2025-01-14 14:32:18
 */

import { LANGUAGES } from '../constants/language.constant';
import { Language } from '../interfaces/language.interface';

export const getLanguages = (locale: string): Language[] => {
  return LANGUAGES.sort((a, b) => (a.code === locale ? -1 : b.code === locale ? 1 : 0));
};
