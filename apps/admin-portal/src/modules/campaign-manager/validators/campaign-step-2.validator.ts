import { z } from 'zod';

export const campaignStep2Schema = z.object({
  nation: z.string(),
  country: z.array(z.object({ id: z.string(), name: z.string() })).min(1, 'Country is mandatory'),
  district: z.array(z.object({ id: z.string(), name: z.string() })),
  keyword: z.string().min(1, 'Keyword is mandatory'),
  dateRange: z.object({
    from: z.date().optional(),
    to: z.date().optional(),
  }),
});
