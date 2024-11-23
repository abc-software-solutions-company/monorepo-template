import { createEntityField } from '@/common/utils/entity-field.util';

import { Category } from '@/modules/categories/entities/category.entity';
import { File } from '@/modules/files/entities/file.entity';
import { User } from '@/modules/users/entities/user.entity';

import { Post } from '../entities/post.entity';
import { PostFile } from '../entities/post-file.entity';

const postFields = createEntityField(Post, {
  fields: ['id', 'name', 'slug', 'description', 'body', 'status', 'cover', 'seoMeta', 'createdAt'],
  alias: 'post',
});

const postUserFields = createEntityField(User, {
  fields: ['id', 'name', 'email'],
  alias: 'post',
});

const postCategoryFields = createEntityField(Category, {
  fields: ['id', 'name'],
  alias: 'post',
});

const postFileFields = createEntityField(PostFile, {
  fields: ['fileId', 'position'],
  alias: 'postFile',
});

const postImageFields = createEntityField(File, {
  fields: ['id', 'uniqueName'],
  alias: 'image',
});

export const POST_GET_FIELDS = [...postFields, ...postUserFields, ...postCategoryFields, ...postFileFields, ...postImageFields]
  .flat()
  .flatMap(item => item.trim().split(/\s+/));

export const POST_FIELDS_TO_CREATE_OR_UPDATE: (keyof Post)[] = ['name', 'slug', 'description', 'body', 'cover'];

export enum POST_STATUS {
  PUBLISHED = 'published',
  DRAFT = 'draft',
  DELETED = 'deleted',
}
