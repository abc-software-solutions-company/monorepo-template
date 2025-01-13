import { Translation } from '@repo/shared-universal/interfaces/language.interface';

export type SeoMeta = {
  // TODO: Will be removed
  title?: string;
  // TODO: Will be removed
  description?: string;
  titleLocalized?: Translation[];
  descriptionLocalized?: Translation[];
  keywords?: string;
};
