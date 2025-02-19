import { z } from 'zod';
import { LANGUAGES } from '@repo/shared-universal/constants/language.constant';
import { Translation } from '@repo/shared-universal/interfaces/language.interface';

import { ResponseFormat } from '@/interfaces/api-response.interface';
import { BaseFilter } from '@/interfaces/filter.interface';
import { SeoMeta } from '@/interfaces/seo-meta.interface';

import { CATEGORY_STATUS, CATEGORY_TYPE } from '../constants/categories.constant';

import { FileEntity } from '@/modules/files/interfaces/files.interface';
import { UserEntity } from '@/modules/users/interfaces/users.interface';

import { categoryFormLocalizeSchema } from '../validators/category-form.validator';

export type CategoryEntity = {
  id: string;
  slug: string;
  type: CATEGORY_TYPE;
  status: CATEGORY_STATUS;
  publishDate: string;
  externalUrl: string;
  coverLocalized: Translation[];
  nameLocalized: Translation[];
  descriptionLocalized: Translation[];
  bodyLocalized: Translation[];
  creator: UserEntity;
  category: CategoryEntity;
  images: FileEntity[];
  parent?: CategoryEntity | null;
  children?: CategoryEntity[] | null;
  path: string;
  seoMeta: SeoMeta;
  createdAt?: string;
  updatedAt?: string;
};

const schema = categoryFormLocalizeSchema(LANGUAGES);

export type CategoryFormData = z.infer<typeof schema>;
export type CategoriesResponse = ResponseFormat<CategoryEntity[]>;
export type CategoryResponse = ResponseFormat<CategoryEntity>;
export type CategoryFilter = BaseFilter & {
  type?: CATEGORY_TYPE;
  parentId?: string | null;
  excludeId?: string;
};
