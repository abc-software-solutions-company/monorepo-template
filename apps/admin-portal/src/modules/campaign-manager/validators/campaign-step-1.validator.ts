import { z } from 'zod';
import { Language } from '@repo/shared-universal/interfaces/language.interface';
import { createLocalizedField } from '@repo/shared-universal/validators/zod';

export const campaignStep1LocalizeSchema = (languages: Language[]) => {
  const defaultlanguage = languages.find(x => x.isDefault);

  if (!defaultlanguage) {
    throw new Error('No default language specified. At least one language must have isDefault set to true.');
  }

  const localizedField = createLocalizedField(defaultlanguage);

  return z
    .object({
      name: localizedField({ min: 1, max: 255, required: true }),
      description: localizedField({ min: 1, max: 255, required: true }),
      tnc: localizedField({ min: 1, max: 255, required: false }),
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
