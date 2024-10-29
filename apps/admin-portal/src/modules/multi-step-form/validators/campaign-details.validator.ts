import { z } from 'zod';

import { Locale } from '../constants/campaign.constant';

export const createCampaignDetailsSchema = (locales: Locale[]) => {
  const defaultLocale = locales.find(locale => locale.isDefault);

  if (!defaultLocale) {
    throw new Error('No default locale specified. At least one locale must have isDefault set to true.');
  }

  const createLocalizedField = (maxLength?: number) =>
    z
      .array(
        z.object({
          lang: z.string(),
          value: maxLength ? z.string().max(maxLength, `Maximum length for this field is only ${maxLength} characters`) : z.string(),
        })
      )
      .min(1, 'This field is mandatory')
      .refine(
        data => {
          const defaultTranslationValue = data.find(item => item.lang === defaultLocale.languageName)?.value;

          return defaultTranslationValue && defaultTranslationValue.trim() !== '';
        },
        {
          message: 'Default field is mandatory',
        }
      );

  return z
    .object({
      name: createLocalizedField(50),
      description: createLocalizedField(300),
      tnc: createLocalizedField(300),
      image_url: createLocalizedField(),
      country: z.array(z.object({})),
      keyword: z.string(),
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
