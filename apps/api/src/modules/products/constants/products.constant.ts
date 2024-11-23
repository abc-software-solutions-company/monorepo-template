import { createEntityField } from '@/common/utils/entity-field.util';

import { Category } from '@/modules/categories/entities/category.entity';
import { User } from '@/modules/users/entities/user.entity';

import { Product } from '../entities/product.entity';
import { ProductFile } from '../entities/product-file.entity';

const productFields = createEntityField(Product, {
  fields: ['id', 'name', 'slug', 'description', 'body', 'status', 'cover', 'seoMeta', 'createdAt'],
  alias: 'product',
});

const productUserFields = createEntityField(User, {
  fields: ['id', 'name', 'email'],
  alias: 'product',
});

const productCategoryFields = createEntityField(Category, {
  fields: ['id', 'name'],
  alias: 'product',
});

const productFileFields = createEntityField(ProductFile, {
  fields: ['fileId', 'position'],
  alias: 'productFile',
});

export const PRODUCT_GET_FIELDS = [...productFields, ...productUserFields, ...productCategoryFields, ...productFileFields]
  .flat()
  .flatMap(item => item.trim().split(/\s+/));

export const PRODUCT_FIELDS_TO_CREATE_OR_UPDATE: (keyof Product)[] = ['name', 'slug', 'description', 'body', 'cover'];

export enum PRODUCT_STATUS {
  PUBLISHED = 'published',
  DRAFT = 'draft',
  DELETED = 'deleted',
}
