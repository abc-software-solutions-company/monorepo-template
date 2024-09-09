import { z } from 'zod';

import { ResponseFormat } from '@/interfaces/api-response.interface';
import { BaseFilter } from '@/interfaces/filter.interface';
import { SeoMeta } from '@/interfaces/seo-meta.interface';

import { CONTENT_STATUS } from '../constants/contents.constant';

import { contentFormValidator } from '../validators/content-form.validator';

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
  seoMeta: SeoMeta;
};

export type ContentFormData = z.infer<typeof contentFormValidator>;

export type ContentsResponse = ResponseFormat<ContentEntity[]>;
export type ContentResponse = ResponseFormat<ContentEntity>;
export type BulkDeleteContentResponse = ContentResponse;

export type ContentFilter = BaseFilter;
