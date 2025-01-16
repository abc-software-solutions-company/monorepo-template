import { z } from 'zod';
import { Language } from '@repo/shared-universal/interfaces/language.interface';
import { createLocalizedField, stringSchema } from '@repo/shared-universal/validators/zod';

import { CONTENT_STATUS } from '../constants/contents.constant';

export const contentFormLocalizeSchema = (languages: Language[]) => {
  const defaultlanguage = languages.find(x => x.isDefault);

  if (!defaultlanguage) {
    throw new Error('No default language specified. At least one language must have isDefault set to true.');
  }

  const localizedField = createLocalizedField(defaultlanguage);

  return z.object({
    name: stringSchema({
      required: false,
      requiredMessage: 'validator_content_name',
      minMessage: 'validator_minimum_n_characters_allowed',
      maxMessage: 'validator_maximum_n_characters_allowed',
    }),
    slug: stringSchema({
      min: 1,
      max: 255,
      required: true,
      requiredMessage: 'validator_content_slug',
      minMessage: 'validator_minimum_n_characters_allowed',
      maxMessage: 'validator_maximum_n_characters_allowed',
    }),
    description: stringSchema({
      required: false,
      requiredMessage: 'validator_content_description',
      minMessage: 'validator_minimum_n_characters_allowed',
      maxMessage: 'validator_maximum_n_characters_allowed',
    }),
    body: stringSchema({
      max: Infinity,
      required: false,
      requiredMessage: 'validator_content_body',
      minMessage: 'validator_minimum_n_characters_allowed',
      maxMessage: 'validator_maximum_n_characters_allowed',
    }),
    status: z.nativeEnum(CONTENT_STATUS, { errorMap: () => ({ message: 'validator_content_status' }) }),
    type: z.string().min(1, 'validator_content_type').max(50, 'validator_maximum_n_characters_allowed'),
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
    // Multi-language
    nameLocalized: localizedField({
      min: 1,
      max: 255,
      required: true,
      requiredMessage: 'validator_content_name',
      minMessage: 'validator_minimum_n_characters_allowed',
      maxMessage: 'validator_maximum_n_characters_allowed',
    }),
    descriptionLocalized: localizedField({
      min: 1,
      max: 2000,
      required: true,
      requiredMessage: 'validator_content_description',
      minMessage: 'validator_minimum_n_characters_allowed',
      maxMessage: 'validator_maximum_n_characters_allowed',
    }),
    bodyLocalized: localizedField({
      min: 1,
      max: Infinity,
      required: true,
      requiredMessage: 'validator_content_body',
      minMessage: 'validator_minimum_n_characters_allowed',
      maxMessage: 'validator_maximum_n_characters_allowed',
    }),
  });
};
