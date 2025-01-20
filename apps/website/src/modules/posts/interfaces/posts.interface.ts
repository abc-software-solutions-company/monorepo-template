import { Translation } from '@repo/shared-universal/interfaces/language.interface';
import { SeoMetadata } from '@repo/shared-universal/interfaces/metadata.interface';

import { ResponseFormat } from '@/interfaces/api-response.interface';
import { BaseFilter } from '@/interfaces/filter.interface';

import { UserEntity } from '@/modules/users/interfaces/users.interface';

export type PostEntity = {
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

export type CreatePostDto = Omit<PostEntity, 'id'>;
export type UpdatePostDto = Partial<CreatePostDto>;
export type PostsResponse = ResponseFormat<PostEntity[]>;
export type PostResponse = ResponseFormat<PostEntity>;
export type PostFilter = BaseFilter & {
  type?: string;
};
