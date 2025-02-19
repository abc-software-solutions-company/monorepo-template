import { z } from 'zod';
import { Language } from '@repo/shared-universal/interfaces/language.interface';
import { createLocalizedField, stringSchema } from '@repo/shared-universal/validators/zod';

import { PRODUCT_STATUS, PRODUCT_TYPE } from '../constants/products.constant';

export const productFormLocalizeSchema = (languages: Language[]) => {
  const defaultlanguage = languages.find(x => x.isDefault);

  if (!defaultlanguage) {
    throw new Error('No default language specified. At least one language must have isDefault set to true.');
  }

  const localizedField = createLocalizedField(defaultlanguage);

  return z.object({
    slug: stringSchema({
      min: 1,
      max: 255,
      required: true,
      requiredMessage: 'validator_product_slug',
      minMessage: 'validator_minimum_n_characters_allowed',
      maxMessage: 'validator_maximum_n_characters_allowed',
    }),
    type: z.nativeEnum(PRODUCT_TYPE, { errorMap: () => ({ message: 'validator_product_type' }) }),
    status: z.nativeEnum(PRODUCT_STATUS, { errorMap: () => ({ message: 'validator_product_status' }) }),
    coverLocalized: localizedField({
      min: undefined,
      max: undefined,
      required: false,
      requiredMessage: 'validator_cover',
      minMessage: 'validator_minimum_n_characters_allowed',
      maxMessage: 'validator_maximum_n_characters_allowed',
    }),
    nameLocalized: localizedField({
      min: 1,
      max: 255,
      required: true,
      requiredMessage: 'validator_product_name',
      minMessage: 'validator_minimum_n_characters_allowed',
      maxMessage: 'validator_maximum_n_characters_allowed',
    }),
    descriptionLocalized: localizedField({
      min: 1,
      max: 2000,
      required: false,
      requiredMessage: 'validator_product_description',
      minMessage: 'validator_minimum_n_characters_allowed',
      maxMessage: 'validator_maximum_n_characters_allowed',
    }),
    bodyLocalized: localizedField({
      min: 1,
      max: Infinity,
      required: false,
      requiredMessage: 'validator_product_body',
      minMessage: 'validator_minimum_n_characters_allowed',
      maxMessage: 'validator_maximum_n_characters_allowed',
    }),
    publishDate: z.date().optional(),
    externalUrl: z.union([z.string().url('validator_url_invalid'), z.string().length(0)]).optional(),
    images: z.object({ id: z.string().uuid({ message: 'validator_id_should_be_an_uuid' }) }).array(),
    categoryId: z.string().optional(),
    seoMeta: z.object({
      titleLocalized: localizedField({
        min: undefined,
        max: 60,
        required: false,
        requiredMessage: 'validator_seo_title',
        minMessage: 'validator_minimum_n_characters_allowed',
        maxMessage: 'validator_maximum_n_characters_allowed',
      }),
      descriptionLocalized: localizedField({
        min: undefined,
        max: 150,
        required: false,
        requiredMessage: 'validator_seo_description',
        minMessage: 'validator_minimum_n_characters_allowed',
        maxMessage: 'validator_maximum_n_characters_allowed',
      }),
      keywords: z
        .string()
        .nullable()
        .optional()
        .refine(value => !value || (value.length >= 1 && value.length <= 150), { message: 'validator_seo_keywords' }),
    }),
  });
};
