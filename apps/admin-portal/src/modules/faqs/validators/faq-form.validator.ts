import { z } from 'zod';
import { Language } from '@repo/shared-universal/interfaces/language.interface';
import { createLocalizedField } from '@repo/shared-universal/validators/zod';

import { FAQ_STATUS } from '../constants/faqs.constant';

export const faqFormLocalizeSchema = (languages: Language[]) => {
  const defaultlanguage = languages.find(x => x.isDefault);

  if (!defaultlanguage) {
    throw new Error('No default language specified. At least one language must have isDefault set to true.');
  }

  const localizedField = createLocalizedField(defaultlanguage);

  return z.object({
    status: z.nativeEnum(FAQ_STATUS, { errorMap: () => ({ message: 'validator_faq_status' }) }),
    titleLocalized: localizedField({
      min: 1,
      max: 255,
      required: true,
      requiredMessage: 'validator_faq_title',
      minMessage: 'validator_minimum_n_characters_allowed',
      maxMessage: 'validator_maximum_n_characters_allowed',
    }),
    descriptionLocalized: localizedField({
      min: 1,
      max: 5000,
      required: true,
      requiredMessage: 'validator_faq_content',
      minMessage: 'validator_minimum_n_characters_allowed',
      maxMessage: 'validator_maximum_n_characters_allowed',
    }),
  });
};
