import { ResponseFormat } from '@/interfaces/api-response.interface';
import { BaseFilter } from '@/interfaces/filter.interface';

import { CATEGORY_STATUS, CATEGORY_TYPE } from '../constants/categories.constant';

import { FileEntity } from '@/modules/files/interfaces/files.interface';

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
};

export type CategoryFormData = {
  name: string;
  slug: string;
  cover: string;
  images: FileEntity[];
  description: string;
  body: string;
  type: CATEGORY_TYPE;
  status: CATEGORY_STATUS;
  parentId?: string;
};

export type CategoriesResponse = ResponseFormat<CategoryEntity[]>;
export type CategoryResponse = ResponseFormat<CategoryEntity>;

export type CategoryFilter = BaseFilter & {
  parentId?: string | null;
  type?: CATEGORY_TYPE;
  excludeId?: string;
};
