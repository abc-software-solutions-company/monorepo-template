import { z } from 'zod';

import { FAQ_STATUS } from '../constants/faqs.constant';

export const faqFormValidator = z.object({
  title: z.string().min(1, 'validator_faq_title').max(255, 'validator_maximum_n_characters_allowed'),
  content: z.string().min(1, 'validator_faq_content').max(2000, 'validator_maximum_n_characters_allowed'),
  status: z.nativeEnum(FAQ_STATUS, { errorMap: () => ({ message: 'validator_faq_status' }) }),
});
