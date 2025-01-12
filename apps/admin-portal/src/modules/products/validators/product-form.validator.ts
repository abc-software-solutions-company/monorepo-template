import { z } from 'zod';
import { baseValidator } from '@repo/shared-universal/validators/zod';

import { PRODUCT_STATUS } from '../constants/products.constant';

export const productFormValidator = z.object({
  name: z.string().min(1, 'validator_product_name').max(255, 'validator_maximum_n_characters_allowed'),
  slug: z.string().min(1, 'validator_product_slug').max(255, 'validator_maximum_n_characters_allowed'),
  description: z.string().min(1, 'validator_product_description').max(2000, 'validator_maximum_n_characters_allowed'),
  body: z.string().min(1, 'validator_product_body'),
  status: z.nativeEnum(PRODUCT_STATUS, { errorMap: () => ({ message: 'validator_product_status' }) }),
  cover: z.string().max(1000, 'validator_maximum_n_characters_allowed'),
  images: z.object({ id: z.string().uuid({ message: 'validator_id_should_be_an_uuid' }) }).array(),
  categoryId: z.string().optional(),
  seoMeta: baseValidator.seo,
});
