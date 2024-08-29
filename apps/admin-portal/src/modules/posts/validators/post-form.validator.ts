import { z } from 'zod';

import { POST_STATUS } from '../constants/posts.constant';

export const postFormValidator = z.object({
  name: z.string().min(1, 'validator_post_name').max(255, 'validator_maximum_n_characters_allowed'),
  slug: z.string().min(1, 'validator_post_slug').max(255, 'validator_maximum_n_characters_allowed'),
  description: z.string().min(1, 'validator_post_description').max(2000, 'validator_maximum_n_characters_allowed'),
  body: z.string().min(1, 'validator_post_body'),
  status: z.nativeEnum(POST_STATUS, { errorMap: () => ({ message: 'validator_post_status' }) }),
  cover: z.string().max(1000, 'validator_maximum_n_characters_allowed'),
  images: z.object({ id: z.string().uuid({ message: 'validator_id_should_be_an_uuid' }) }).array(),
  categoryId: z.string().optional(),
});
