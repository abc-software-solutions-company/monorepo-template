import { z } from 'zod';
import { Language } from '@repo/shared-universal/interfaces/language.interface';
import { createLocalizedField, stringSchema } from '@repo/shared-universal/validators/zod';

import { POST_STATUS } from '../constants/posts.constant';

export const postFormLocalizeSchema = (languages: Language[]) => {
  const defaultlanguage = languages.find(x => x.isDefault);

  if (!defaultlanguage) {
    throw new Error('No default language specified. At least one language must have isDefault set to true.');
  }

  const localizedField = createLocalizedField(defaultlanguage);

  return z.object({
    name: stringSchema({
      required: false,
      requiredMessage: 'validator_post_name',
      minMessage: 'validator_minimum_n_characters_allowed',
      maxMessage: 'validator_maximum_n_characters_allowed',
    }),
    slug: stringSchema({
      min: 1,
      max: 255,
      required: true,
      requiredMessage: 'validator_post_slug',
      minMessage: 'validator_minimum_n_characters_allowed',
      maxMessage: 'validator_maximum_n_characters_allowed',
    }),
    description: stringSchema({
      required: false,
      requiredMessage: 'validator_post_description',
      minMessage: 'validator_minimum_n_characters_allowed',
      maxMessage: 'validator_maximum_n_characters_allowed',
    }),
    body: stringSchema({
      max: Infinity,
      required: false,
      requiredMessage: 'validator_post_body',
      minMessage: 'validator_minimum_n_characters_allowed',
      maxMessage: 'validator_maximum_n_characters_allowed',
    }),
    type: z.string().nullable(),
    status: z.nativeEnum(POST_STATUS, { errorMap: () => ({ message: 'validator_post_status' }) }),
    // TODO: Will be removed
    cover: z.string().max(1000, 'validator_maximum_n_characters_allowed'),
    coverLocalized: localizedField({
      min: undefined,
      max: undefined,
      required: false,
      requiredMessage: 'validator_cover',
      minMessage: 'validator_minimum_n_characters_allowed',
      maxMessage: 'validator_maximum_n_characters_allowed',
    }),
    images: z.object({ id: z.string().uuid({ message: 'validator_id_should_be_an_uuid' }) }).array(),
    categoryId: z.string().optional(),
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
      requiredMessage: 'validator_post_name',
      minMessage: 'validator_minimum_n_characters_allowed',
      maxMessage: 'validator_maximum_n_characters_allowed',
    }),
    descriptionLocalized: localizedField({
      min: 1,
      max: 2000,
      required: true,
      requiredMessage: 'validator_post_description',
      minMessage: 'validator_minimum_n_characters_allowed',
      maxMessage: 'validator_maximum_n_characters_allowed',
    }),
    bodyLocalized: localizedField({
      min: 1,
      max: Infinity,
      required: true,
      requiredMessage: 'validator_post_body',
      minMessage: 'validator_minimum_n_characters_allowed',
      maxMessage: 'validator_maximum_n_characters_allowed',
    }),
  });
};
