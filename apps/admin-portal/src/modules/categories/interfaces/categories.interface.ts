import { z } from 'zod';
import { LANGUAGES } from '@repo/shared-universal/constants/language.constant';
import { Translation } from '@repo/shared-universal/interfaces/language.interface';

import { ResponseFormat } from '@/interfaces/api-response.interface';
import { BaseFilter } from '@/interfaces/filter.interface';
import { SeoMeta } from '@/interfaces/seo-meta.interface';

import { CATEGORY_STATUS, CATEGORY_TYPE } from '../constants/categories.constant';

import { FileEntity } from '@/modules/files/interfaces/files.interface';

import { categoriesFormLocalizeSchema } from '../validators/category-form.validator';

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
  nameLocalized: Translation[];
  bodyLocalized: Translation[];
  descriptionLocalized: Translation[];
  coverLocalized: Translation[];
};

const categoriesSchema = categoriesFormLocalizeSchema(LANGUAGES);

export type CategoryFormData = z.infer<typeof categoriesSchema>;

export type CategoriesResponse = ResponseFormat<CategoryEntity[]>;
export type CategoryResponse = ResponseFormat<CategoryEntity>;

export type CategoryFilter = BaseFilter & {
  parentId?: string | null;
  type?: CATEGORY_TYPE;
  excludeId?: string;
};
