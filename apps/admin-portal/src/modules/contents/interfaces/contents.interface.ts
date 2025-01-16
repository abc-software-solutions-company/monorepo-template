import { z } from 'zod';
import { LANGUAGES } from '@repo/shared-universal/constants/language.constant';
import { Translation } from '@repo/shared-universal/interfaces/language.interface';

import { ResponseFormat } from '@/interfaces/api-response.interface';
import { BaseFilter } from '@/interfaces/filter.interface';
import { SeoMeta } from '@/interfaces/seo-meta.interface';

import { CONTENT_STATUS } from '../constants/contents.constant';

import { contentFormLocalizeSchema } from '../validators/content-form.validator';

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
  nameLocalized: Translation[];
  bodyLocalized: Translation[];
  descriptionLocalized: Translation[];
};

const contentSchema = contentFormLocalizeSchema(LANGUAGES);

export type ContentFormData = z.infer<typeof contentSchema>;

export type ContentsResponse = ResponseFormat<ContentEntity[]>;
export type ContentResponse = ResponseFormat<ContentEntity>;
export type BulkDeleteContentResponse = ContentResponse;

export type ContentFilter = BaseFilter;
