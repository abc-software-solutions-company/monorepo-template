import { z } from 'zod';
import { baseValidator } from '@repo/shared-universal/validators/zod';

export const signInValidator = z.object({
  email: baseValidator.email,
  password: baseValidator.password,
});
