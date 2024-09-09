import { z } from 'zod';

import { ResponseFormat } from '@/interfaces/api-response.interface';
import { BaseFilter } from '@/interfaces/filter.interface';
import { SeoMeta } from '@/interfaces/seo-meta.interface';

import { CATEGORY_STATUS, CATEGORY_TYPE } from '../constants/categories.constant';

import { FileEntity } from '@/modules/files/interfaces/files.interface';

import { categoryFormValidator } from '../validators/category-form.validator';

export type CategoryEntity = {
  id: string;
  name: string;
  slug: string;
  description: string;
  body: string;
  path: string;
  type: CATEGORY_TYPE;
  status: CATEGORY_STATUS;
  cover: string;
  images: FileEntity[];
  parent?: CategoryEntity | null;
  children?: CategoryEntity[] | null;
  createdAt?: string;
  updatedAt?: string;
  category: CategoryEntity;
  seoMeta: SeoMeta;
};

export type CategoryFormData = z.infer<typeof categoryFormValidator>;

export type CategoriesResponse = ResponseFormat<CategoryEntity[]>;
export type CategoryResponse = ResponseFormat<CategoryEntity>;

export type CategoryFilter = BaseFilter & {
  parentId?: string | null;
  type?: CATEGORY_TYPE;
  excludeId?: string;
};
