import { z } from 'zod';
import { baseValidator } from '@repo/shared-universal/validators/zod';

export const updateProfileValidator = z.object({
  name: baseValidator.userName,
  phoneNumber: baseValidator.phoneNumber,
  dateOfBirth: z.date({ message: 'validator_date_required' }),
  country: z.string().optional(),
  bio: z.string().max(2000, 'validator_maximum_n_characters_allowed'),
});
