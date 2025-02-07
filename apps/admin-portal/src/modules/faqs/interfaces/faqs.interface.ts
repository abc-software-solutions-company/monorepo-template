import { z } from 'zod';
import { LANGUAGES } from '@repo/shared-universal/constants/language.constant';
import { Translation } from '@repo/shared-universal/interfaces/language.interface';

import { ResponseFormat } from '@/interfaces/api-response.interface';
import { BaseFilter } from '@/interfaces/filter.interface';

import { FAQ_STATUS } from '../constants/faqs.constant';

import { faqFormLocalizeSchema } from '../validators/faq-form.validator';

export type FaqEntity = {
  id: string;
  titleLocalized: Translation[];
  descriptionLocalized: Translation[];
  status: FAQ_STATUS;
  createdAt: string;
  updatedAt: string;
};

const post = faqFormLocalizeSchema(LANGUAGES);

export type FaqFormData = z.infer<typeof post>;
export type FaqsResponse = ResponseFormat<FaqEntity[]>;
export type FaqResponse = ResponseFormat<FaqEntity>;
export type BulkDeleteFaqResponse = FaqResponse;
export type FaqFilter = BaseFilter;
