import { z } from 'zod';
import { baseValidator } from '@repo/shared-universal/validators/zod';

export const updateProfileValidator = z.object({
  name: baseValidator.userName,
  phoneNumber: baseValidator.phoneNumber,
});
