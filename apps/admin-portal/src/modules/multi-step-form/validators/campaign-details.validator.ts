import { z } from 'zod';

import { Locale } from '../constants/campaign.constant';

export const createCampaignDetailsSchema = (locales: Locale[]) => {
  const defaultLocale = locales.find(locale => locale.isDefault);

  if (!defaultLocale) {
    throw new Error('No default locale specified. At least one locale must have isDefault set to true.');
  }

  const createLocalizedField = (fieldName: string, maxLength = 50) =>
    z
      .array(
        z.object({
          lang: z.string(),
          value: z.string().max(50, `Maximum length for this field is only ${maxLength} characters`),
        })
      )
      .min(1, `${fieldName} must have at least one language`)
      .refine(
        data => {
          const defaultLocaleValue = data.find(item => item.lang === defaultLocale.languageName)?.value;

          return defaultLocaleValue && defaultLocaleValue.trim() !== '';
        },
        {
          message: `Value for default language (${defaultLocale.languageLabel}) is required`,
        }
      );

  return z
    .object({
      name: createLocalizedField('Name'),
      description: createLocalizedField('Description', 300),
      tnc: createLocalizedField('Terms and Conditions', 300),
      startDate: z.date().optional(),
      endDate: z.date().optional(),
    })
    .refine(data => data.startDate !== undefined, { message: 'Start date is required', path: ['startDate'] })
    .refine(data => data.endDate !== undefined, { message: 'End date is required', path: ['endDate'] })
    .refine(
      data => {
        if (!data.startDate || !data.endDate) return false;

        return data.endDate >= data.startDate;
      },
      { message: 'End date must be after or equal to start date', path: ['endDate'] }
    );
};
