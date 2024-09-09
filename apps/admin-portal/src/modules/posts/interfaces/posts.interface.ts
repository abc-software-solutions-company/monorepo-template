import { z } from 'zod';

import { ResponseFormat } from '@/interfaces/api-response.interface';
import { BaseFilter } from '@/interfaces/filter.interface';
import { SeoMeta } from '@/interfaces/seo-meta.interface';

import { POST_STATUS } from '../constants/posts.constant';

import { CategoryEntity } from '@/modules/categories/interfaces/categories.interface';
import { FileEntity } from '@/modules/files/interfaces/files.interface';
import { UserEntity } from '@/modules/users/interfaces/users.interface';

import { postFormValidator } from '../validators/post-form.validator';

export type PostEntity = {
  id: string;
  name: string;
  slug: string;
  description: string;
  body: string;
  status: POST_STATUS;
  creator: UserEntity;
  cover: string;
  images: FileEntity[];
  createdAt: string;
  updatedAt: string;
  category: CategoryEntity;
  seoMeta: SeoMeta;
};

export type PostFormData = z.infer<typeof postFormValidator>;

export type PostsResponse = ResponseFormat<PostEntity[]>;
export type PostResponse = ResponseFormat<PostEntity>;
export type BulkDeletePostResponse = PostResponse;

export type PostFilter = BaseFilter;
