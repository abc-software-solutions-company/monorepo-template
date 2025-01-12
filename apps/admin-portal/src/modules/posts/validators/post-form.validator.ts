import { z } from 'zod';
import { Language } from '@repo/shared-universal/interfaces/language.interface';
import { baseValidator, stringSchema } from '@repo/shared-universal/validators/zod';

import { POST_STATUS } from '../constants/posts.constant';

export const postFormLocalizeSchema = (languages: Language[]) => {
  const defaultlanguage = languages.find(x => x.isDefault);

  if (!defaultlanguage) {
    throw new Error('No default language specified. At least one language must have isDefault set to true.');
  }

  // const localizedField = createLocalizedField(defaultlanguage);

  return z.object({
    name: stringSchema({
      min: 1,
      max: 255,
      required: true,
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
      min: 1,
      max: 2000,
      required: true,
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

    status: z.nativeEnum(POST_STATUS, { errorMap: () => ({ message: 'validator_post_status' }) }),
    cover: z.string().max(1000, 'validator_maximum_n_characters_allowed'),
    images: z.object({ id: z.string().uuid({ message: 'validator_id_should_be_an_uuid' }) }).array(),
    categoryId: z.string().optional(),
    seoMeta: baseValidator.seo,
    // Multi-language
    // nameLocalized: localizedField({
    //   min: 1,
    //   max: 255,
    //   required: true,
    //   requiredMessage: 'validator_post_name',
    //   minMessage: 'validator_minimum_n_characters_allowed',
    //   maxMessage: 'validator_maximum_n_characters_allowed',
    // }),
    // descriptionLocalized: localizedField({
    //   min: 1,
    //   max: 2000,
    //   required: true,
    //   requiredMessage: 'validator_post_description',
    //   minMessage: 'validator_minimum_n_characters_allowed',
    //   maxMessage: 'validator_maximum_n_characters_allowed',
    // }),
    // bodyLocalized: localizedField({
    //   max: Infinity,
    //   required: false,
    //   requiredMessage: 'validator_post_body',
    //   minMessage: 'validator_minimum_n_characters_allowed',
    //   maxMessage: 'validator_maximum_n_characters_allowed',
    // }),
  });
};
