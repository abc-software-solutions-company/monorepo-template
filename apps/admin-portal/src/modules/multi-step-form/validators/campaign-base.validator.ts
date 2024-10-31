import { z } from 'zod';

import { Locale } from '@/interfaces/language.interface';

export const createLocalizedField = (defaultLocale: Locale) => (fieldName?: string | null, maxLength?: number) =>
  z
    .array(z.object({ lang: z.string(), value: z.string() }))
    .min(1, `${fieldName ?? 'This field'} is mandatory`)
    .refine(
      data => {
        const defaultTranslationValue = data.find(item => item.lang === defaultLocale.languageName)?.value;

        return defaultTranslationValue && defaultTranslationValue.trim() !== '';
      },
      { message: 'Default field is mandatory' }
    )
    .refine(
      data => {
        if (!maxLength) return true;

        return data.every(item => item.value.length <= maxLength);
      },
      { message: `Maximum length for this field is only ${maxLength} characters` }
    );

export const createLocalizedFieldAndValidateMaxLength = (maxLength?: number) =>
  z.array(z.object({ lang: z.string(), value: z.string() })).refine(
    data => {
      if (!maxLength) return true;

      return data.every(item => item.value.length <= maxLength);
    },
    { message: `Maximum length for this field is only ${maxLength} characters` }
  );
