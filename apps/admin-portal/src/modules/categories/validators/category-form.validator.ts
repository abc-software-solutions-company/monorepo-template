import { z } from 'zod';
import { Language } from '@repo/shared-universal/interfaces/language.interface';
import { createLocalizedField, stringSchema } from '@repo/shared-universal/validators/zod';

import { CATEGORY_STATUS, CATEGORY_TYPE } from '../constants/categories.constant';

export const categoriesFormLocalizeSchema = (languages: Language[]) => {
  const defaultlanguage = languages.find(x => x.isDefault);

  if (!defaultlanguage) {
    throw new Error('No default language specified. At least one language must have isDefault set to true.');
  }

  const localizedField = createLocalizedField(defaultlanguage);

  return z.object({
    name: stringSchema({
      required: false,
      requiredMessage: 'validator_category_name',
      minMessage: 'validator_minimum_n_characters_allowed',
      maxMessage: 'validator_maximum_n_characters_allowed',
    }),
    slug: stringSchema({
      min: 1,
      max: 255,
      required: true,
      requiredMessage: 'validator_product_slug',
      minMessage: 'validator_minimum_n_characters_allowed',
      maxMessage: 'validator_maximum_n_characters_allowed',
    }),
    description: stringSchema({
      required: false,
      requiredMessage: 'validator_category_description',
      minMessage: 'validator_minimum_n_characters_allowed',
      maxMessage: 'validator_maximum_n_characters_allowed',
    }),
    body: stringSchema({
      max: Infinity,
      required: false,
      requiredMessage: 'validator_category_body',
      minMessage: 'validator_minimum_n_characters_allowed',
      maxMessage: 'validator_maximum_n_characters_allowed',
    }),
    // Multi-language
    nameLocalized: localizedField({
      min: 1,
      max: 255,
      required: true,
      requiredMessage: 'validator_category_name',
      minMessage: 'validator_minimum_n_characters_allowed',
      maxMessage: 'validator_maximum_n_characters_allowed',
    }),
    descriptionLocalized: localizedField({
      min: 1,
      max: 2000,
      required: true,
      requiredMessage: 'validator_category_description',
      minMessage: 'validator_minimum_n_characters_allowed',
      maxMessage: 'validator_maximum_n_characters_allowed',
    }),
    bodyLocalized: localizedField({
      min: 1,
      max: Infinity,
      required: false,
    }),
    coverLocalized: localizedField({
      min: undefined,
      max: undefined,
      required: false,
      requiredMessage: 'validator_cover',
      minMessage: 'validator_minimum_n_characters_allowed',
      maxMessage: 'validator_maximum_n_characters_allowed',
    }),
    status: z.nativeEnum(CATEGORY_STATUS, { errorMap: () => ({ message: 'validator_category_status' }) }),
    images: z.object({ id: z.string().uuid({ message: 'validator_id_should_be_an_uuid' }) }).array(),
    type: z.nativeEnum(CATEGORY_TYPE, { errorMap: () => ({ message: 'validator_category_type' }) }),
    parentId: z.string().optional(),
    // TODO: Will be removed
    // SEO
    seoMeta: z.object({
      // TODO: Will be removed
      title: z
        .string()
        .nullable()
        .optional()
        .refine(value => !value || (value.length >= 1 && value.length <= 60), { message: 'validator_seo_title' }),
      // TODO: Will be removed
      description: z
        .string()
        .nullable()
        .optional()
        .refine(value => !value || (value.length >= 1 && value.length <= 150), { message: 'validator_seo_description' }),
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
