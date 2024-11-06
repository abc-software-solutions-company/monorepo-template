import { z } from 'zod';

import { Locale } from '@/interfaces/language.interface';

import { createLocalizedField, createLocalizedFieldAndValidateMaxLength } from './campaign-base.validator';

export const campaignStep1LocalizeSchema = (locales: Locale[]) => {
  const defaultLocale = locales.find(locale => locale.isDefault);

  if (!defaultLocale) {
    throw new Error('No default locale specified. At least one locale must have isDefault set to true.');
  }

  const localizedField = createLocalizedField(defaultLocale);

  return z
    .object({
      name: localizedField('Name', 50),
      description: localizedField('Description', 300),
      tnc: createLocalizedFieldAndValidateMaxLength(300),
      imageUrl: localizedField(),
      startDate: z.date().optional(),
      endDate: z.date().optional(),
    })
    .refine(data => data.startDate !== undefined, { message: 'Start date is mandatory', path: ['startDate'] })
    .refine(data => data.endDate !== undefined, { message: 'End date is mandatory', path: ['endDate'] })
    .refine(
      data => {
        if (!data.startDate || !data.endDate) return false;

        return data.endDate >= data.startDate;
      },
      { message: 'End date must be after or equal to start date', path: ['endDate'] }
    );
};
