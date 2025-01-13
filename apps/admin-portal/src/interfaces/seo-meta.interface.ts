import { Translation } from '@repo/shared-universal/interfaces/language.interface';

export type SeoMeta = {
  title?: string; // TODO: Will be removed
  description?: string; // TODO: Will be removed
  titleLocalized?: Translation[];
  descriptionLocalized?: Translation[];
  keywords?: string;
};
