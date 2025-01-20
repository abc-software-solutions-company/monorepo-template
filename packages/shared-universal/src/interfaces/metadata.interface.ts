/*
 * @Author: <Tin Tran> (tin.tran@abcdigital.io)
 * @Created: 2025-01-13 20:25:05
 */

import { Translation } from './language.interface';

export type SeoMetadata = {
  titleLocalized?: Translation[];
  descriptionLocalized?: Translation[];
  keywords?: string;
};
