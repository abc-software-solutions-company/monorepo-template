import { z } from 'zod';
import { LANGUAGES } from '@repo/shared-universal/constants/language.constant';
import { Translation } from '@repo/shared-universal/interfaces/language.interface';

import { ResponseFormat } from '@/interfaces/api-response.interface';
import { BaseFilter } from '@/interfaces/filter.interface';
import { SeoMeta } from '@/interfaces/seo-meta.interface';

import { POST_STATUS } from '../constants/posts.constant';

import { CategoryEntity } from '@/modules/categories/interfaces/categories.interface';
import { FileEntity } from '@/modules/files/interfaces/files.interface';
import { UserEntity } from '@/modules/users/interfaces/users.interface';

import { postFormLocalizeSchema } from '../validators/post-form.validator';

export type PostEntity = {
  id: string;
  name: string; // TODO: Will be removed
  slug: string;
  type: string;
  description: string; // TODO: Will be removed
  body: string; // TODO: Will be removed
  status: POST_STATUS;
  creator: UserEntity;
  cover: string; // TODO: Will be removed
  coverLocalized: Translation[];
  images: FileEntity[];
  createdAt: string;
  updatedAt: string;
  category: CategoryEntity;
  seoMeta: SeoMeta;
  nameLocalized: Translation[];
  descriptionLocalized: Translation[];
  bodyLocalized: Translation[];
};

const postSchema = postFormLocalizeSchema(LANGUAGES);

export type PostFormData = z.infer<typeof postSchema>;
export type PostsResponse = ResponseFormat<PostEntity[]>;
export type PostResponse = ResponseFormat<PostEntity>;
export type BulkDeletePostResponse = PostResponse;
export type PostFilter = { type?: string } & BaseFilter;
