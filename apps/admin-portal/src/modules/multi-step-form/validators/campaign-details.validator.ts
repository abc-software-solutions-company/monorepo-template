import { z } from 'zod';

import { Locale } from '../constants/campaign.constant';

export const createCampaignDetailsSchema = (locales: Locale[]) => {
  const defaultLocale = locales.find(locale => locale.isDefault);

  if (!defaultLocale) {
    throw new Error('No default locale specified. At least one locale must have isDefault set to true.');
  }

  return z.object({
    text: z.string(),
    name: z
      .array(
        z.object({
          lang: z.string(),
          value: z.string().max(50, 'Maximum length for this field is only 50 characters'),
        })
      )
      .min(1, 'Name must have at least one language')
      .refine(
        data => {
          const defaultLocaleValue = data.find(item => item.lang === defaultLocale.languageName)?.value;

          return defaultLocaleValue && defaultLocaleValue.trim() !== '';
        },
        {
          message: `Value for default language (${defaultLocale.languageLabel}) is required`,
        }
      ),
    description: z
      .array(
        z.object({
          lang: z.string(),
          value: z.string().max(50, 'Maximum length for this field is only 50 characters'),
        })
      )
      .min(1, 'Name must have at least one language')
      .refine(
        data => {
          const defaultLocaleValue = data.find(item => item.lang === defaultLocale.languageName)?.value;

          return defaultLocaleValue && defaultLocaleValue.trim() !== '';
        },
        {
          message: `Value for default language (${defaultLocale.languageLabel}) is required`,
        }
      ),

    tnc: z
      .array(
        z.object({
          lang: z.string(),
          value: z.string().max(50, 'Maximum length for this field is only 50 characters'),
        })
      )
      .min(1, 'Name must have at least one language')
      .refine(
        data => {
          const defaultLocaleValue = data.find(item => item.lang === defaultLocale.languageName)?.value;

          return defaultLocaleValue && defaultLocaleValue.trim() !== '';
        },
        {
          message: `Value for default language (${defaultLocale.languageLabel}) is required`,
        }
      ),
  });
};
