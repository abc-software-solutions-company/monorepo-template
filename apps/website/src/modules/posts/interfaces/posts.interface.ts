import { Translation } from '@repo/shared-universal/interfaces/language.interface';

import { ResponseFormat } from '@/interfaces/api-response.interface';
import { BaseFilter } from '@/interfaces/filter.interface';

export type PostEntity = {
  id: string;
  name: string;
  slug: string;
  description: string;
  body: boolean;
  nameLocalized?: Translation[];
  descriptionLocalized?: Translation[];
  bodyLocalized?: Translation[];
  createdAt: Date;
  updatedAt: Date;
};

export type CreatePostDto = Omit<PostEntity, 'id'>;
export type UpdatePostDto = Partial<CreatePostDto>;

export type PostsResponse = ResponseFormat<PostEntity[]>;
export type PostResponse = ResponseFormat<PostEntity>;

export type PostFilter = BaseFilter;
