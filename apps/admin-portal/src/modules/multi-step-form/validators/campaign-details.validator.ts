import { z } from 'zod';

export const campaignDetailsSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Email is invalid'),
  products: z.array(z.string()).min(1, 'Product is required'),
});
