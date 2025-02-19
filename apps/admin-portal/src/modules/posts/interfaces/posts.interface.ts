import { z } from 'zod';
import { LANGUAGES } from '@repo/shared-universal/constants/language.constant';
import { Translation } from '@repo/shared-universal/interfaces/language.interface';

import { ResponseFormat } from '@/interfaces/api-response.interface';
import { BaseFilter } from '@/interfaces/filter.interface';
import { SeoMeta } from '@/interfaces/seo-meta.interface';

import { POST_STATUS, POST_TYPE } from '../constants/posts.constant';

import { CategoryEntity } from '@/modules/categories/interfaces/categories.interface';
import { FileEntity } from '@/modules/files/interfaces/files.interface';
import { UserEntity } from '@/modules/users/interfaces/users.interface';

import { postFormLocalizeSchema } from '../validators/post-form.validator';

export type PostEntity = {
  id: string;
  slug: string;
  type: POST_TYPE;
  status: POST_STATUS;
  order: number;
  publishDate: string;
  externalUrl: string;
  coverLocalized: Translation[];
  nameLocalized: Translation[];
  descriptionLocalized: Translation[];
  bodyLocalized: Translation[];
  creator: UserEntity;
  category: CategoryEntity;
  images: FileEntity[];
  seoMeta: SeoMeta;
  createdAt: string;
  updatedAt: string;
};

const post = postFormLocalizeSchema(LANGUAGES);

export type CreatePostDto = z.infer<typeof post>;
export type UpdatePostDto = Partial<CreatePostDto>;
export type PostsResponse = ResponseFormat<PostEntity[]>;
export type PostResponse = ResponseFormat<PostEntity>;
export type BulkDeletePostResponse = PostResponse;
export type PostFilter = BaseFilter & {
  type?: POST_TYPE;
};
