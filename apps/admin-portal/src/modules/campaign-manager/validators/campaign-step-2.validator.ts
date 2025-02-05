import { z } from 'zod';

export const campaignStep2Schema = z.object({
  nation: z.string().min(1, 'Nation is mandatory'),
  country: z.array(z.object({ id: z.string(), name: z.string().optional() })).min(1, 'Country is mandatory'),
  district: z.array(z.object({ id: z.string(), name: z.string().optional() })).min(1, 'District is mandatory'),
  keyword: z.string().min(1, 'Keyword is mandatory'),
  dateRange: z
    .object({
      from: z.date({ required_error: 'Start date is mandatory', invalid_type_error: 'Start date must be a valid date' }),
      to: z.date({ required_error: 'End date is mandatory', invalid_type_error: 'End date must be a valid date' }),
    })
    .optional()
    .refine(data => data?.from || data?.to, { message: 'Date range is mandatory' }),
});
