import { z } from 'zod';

import { CONTENT_STATUS } from '../constants/contents.constant';

export const contentFormValidator = z.object({
  name: z.string().min(1, 'validator_content_name').max(255, 'validator_maximum_n_characters_allowed'),
  slug: z.string().min(1, 'validator_content_slug').max(255, 'validator_maximum_n_characters_allowed'),
  description: z.string().max(2000, 'validator_maximum_n_characters_allowed').optional(),
  body: z.string().min(1, 'validator_content_body'),
  status: z.nativeEnum(CONTENT_STATUS, { errorMap: () => ({ message: 'validator_content_status' }) }),
  type: z.string().min(1, 'validator_content_type').max(50, 'validator_maximum_n_characters_allowed'),
});
