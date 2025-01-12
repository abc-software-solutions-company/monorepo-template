import { z } from 'zod';
import { baseValidator } from '@repo/shared-universal/validators/zod';

import { CATEGORY_STATUS, CATEGORY_TYPE } from '../constants/categories.constant';

export const categoryFormValidator = z.object({
  name: z.string().min(1, 'validator_category_name').max(255, 'validator_maximum_n_characters_allowed'),
  slug: z.string().min(1, 'validator_category_slug').max(255, 'validator_maximum_n_characters_allowed'),
  description: z.string().max(2000, 'validator_maximum_n_characters_allowed').optional(),
  body: z.string().optional(),
  status: z.nativeEnum(CATEGORY_STATUS, { errorMap: () => ({ message: 'validator_category_status' }) }),
  cover: z.string().max(1000, 'validator_maximum_n_characters_allowed'),
  images: z.object({ id: z.string().uuid({ message: 'validator_id_should_be_an_uuid' }) }).array(),
  type: z.nativeEnum(CATEGORY_TYPE, { errorMap: () => ({ message: 'validator_category_type' }) }),
  parentId: z.string().optional(),
  seoMeta: baseValidator.seo,
});
