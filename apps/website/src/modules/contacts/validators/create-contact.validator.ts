import { z } from 'zod';
import { baseValidator } from '@repo/shared-universal/validators/zod';

export const createContactValidator = z.object({
  name: z.string(),
  email: baseValidator.email,
  message: z.string(),
});
