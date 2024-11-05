import { z } from 'zod';

export const campaignStep2Schema = z.object({
  country: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    )
    .min(1, 'Country is mandatory'),
  keyword: z.string().min(1, 'Keyword is mandatory'),
});
