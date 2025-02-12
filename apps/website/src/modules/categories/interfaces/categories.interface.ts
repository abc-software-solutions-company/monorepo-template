import { Translation } from '@repo/shared-universal/interfaces/language.interface';
import { SeoMetadata } from '@repo/shared-universal/interfaces/metadata.interface';

import { ResponseFormat } from '@/interfaces/api-response.interface';
import { BaseFilter } from '@/interfaces/filter.interface';

import { CATEGORY_TYPE } from '../constants/categories.constant';

import { UserEntity } from '@/modules/users/interfaces/users.interface';

export type CategoryEntity = {
  id: string;
  name: string;
  slug: string;
  description: string;
  body: boolean;
  coverLocalized: Translation[];
  nameLocalized: Translation[];
  descriptionLocalized: Translation[];
  bodyLocalized: Translation[];
  seoMeta: SeoMetadata;
  createdAt: Date;
  updatedAt: Date;
  creator: UserEntity;
};

export type CreateCategoryDto = Omit<CategoryEntity, 'id'>;
export type UpdateCategoryDto = Partial<CreateCategoryDto>;
export type CategoriesResponse = ResponseFormat<CategoryEntity[]>;
export type CategoryResponse = ResponseFormat<CategoryEntity>;
export type CategoryFilter = BaseFilter & {
  type?: CATEGORY_TYPE;
  parentId?: string;
  excludeId?: string;
};
