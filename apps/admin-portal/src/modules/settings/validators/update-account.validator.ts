import { z } from 'zod';

export const updateAccountValidator = z.object({
  language: z.string({ required_error: 'validator_select_language' }),
});
