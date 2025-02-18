import { Translation } from '@repo/shared-universal/interfaces/language.interface';
import { SeoMetadata } from '@repo/shared-universal/interfaces/metadata.interface';

import { ResponseFormat } from '@/interfaces/api-response.interface';
import { BaseFilter } from '@/interfaces/filter.interface';

import { POST_TYPE } from '../constants/posts.constant';

import { CategoryEntity } from '@/modules/categories/interfaces/categories.interface';
import { UserEntity } from '@/modules/users/interfaces/users.interface';

export type PostEntity = {
  id: string;
  slug: string;
  order: number;
  coverLocalized: Translation[];
  nameLocalized: Translation[];
  descriptionLocalized: Translation[];
  bodyLocalized: Translation[];
  seoMeta: SeoMetadata;
  createdAt: Date;
  updatedAt: Date;
  creator: UserEntity;
  category: CategoryEntity;
};

export type CreatePostDto = Omit<PostEntity, 'id'>;
export type UpdatePostDto = Partial<CreatePostDto>;
export type PostsResponse = ResponseFormat<PostEntity[]>;
export type PostResponse = ResponseFormat<PostEntity>;
export type PostFilter = {
  type?: POST_TYPE;
  categoryId?: string;
  year?: number;
} & BaseFilter;
