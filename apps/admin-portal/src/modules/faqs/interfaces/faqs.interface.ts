import { ResponseFormat } from '@/interfaces/api-response.interface';
import { BaseFilter } from '@/interfaces/filter.interface';

import { FAQ_STATUS } from '../constants/faqs.constant';

export type FaqEntity = {
  id: string;
  title: string;
  content: string;
  status: FAQ_STATUS;
  createdAt: string;
  updatedAt: string;
};

export type FaqFormData = {
  title: string;
  content: string;
  status: FAQ_STATUS;
};

export type FaqsResponse = ResponseFormat<FaqEntity[]>;
export type FaqResponse = ResponseFormat<FaqEntity>;
export type BulkDeleteFaqResponse = FaqResponse;

export type FaqFilter = BaseFilter;
