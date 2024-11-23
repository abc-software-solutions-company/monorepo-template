import { createEntityField } from '@/common/utils/entity-field.util';

import { File } from '@/modules/files/entities/file.entity';
import { User } from '@/modules/users/entities/user.entity';

import { Category } from '../entities/category.entity';
import { CategoryFile } from '../entities/category-file.entity';

const categoryFields = createEntityField(Category, {
  fields: ['id', 'name', 'slug', 'description', 'body', 'type', 'parent', 'status', 'cover', 'seoMeta', 'createdAt'],
  alias: 'category',
});

const categoryUserFields = createEntityField(User, {
  fields: ['id', 'name', 'email'],
  alias: 'category',
});

const categoryParentFields = createEntityField(Category, {
  fields: ['id', 'name'],
  alias: 'parent',
});

const categoryFileFields = createEntityField(CategoryFile, {
  fields: ['fileId', 'position'],
  alias: 'categoryFile',
});

const categoryImageFields = createEntityField(File, {
  fields: ['id', 'uniqueName'],
  alias: 'image',
});

export const CATEGORY_GET_FIELDS = [...categoryFields, ...categoryUserFields, ...categoryParentFields, ...categoryFileFields, ...categoryImageFields]
  .flat()
  .flatMap(item => item.trim().split(/\s+/));

export const CATEGORY_FIELDS_TO_CREATE_OR_UPDATE = ['name', 'slug', 'description', 'body', 'cover'] as const;

export enum CATEGORY_STATUS {
  VISIBLED = 'visibled',
  DELETED = 'deleted',
}

export enum CATEGORY_TYPE {
  FILE = 'file',
  PRODUCT = 'product',
  POST = 'post',
}
