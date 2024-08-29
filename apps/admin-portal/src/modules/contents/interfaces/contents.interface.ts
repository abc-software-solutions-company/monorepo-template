import { ResponseFormat } from '@/interfaces/api-response.interface';
import { BaseFilter } from '@/interfaces/filter.interface';

import { CONTENT_STATUS } from '../constants/contents.constant';

export type ContentEntity = {
  id: string;
  name: string;
  slug: string;
  description: string;
  body: string;
  type: string;
  status: CONTENT_STATUS;
  createdAt: string;
  updatedAt: string;
};

export type ContentFormData = {
  name: string;
  slug: string;
  description: string;
  body: string;
  type: string;
  status: CONTENT_STATUS;
};

export type ContentsResponse = ResponseFormat<ContentEntity[]>;
export type ContentResponse = ResponseFormat<ContentEntity>;
export type BulkDeleteContentResponse = ContentResponse;

export type ContentFilter = BaseFilter;
