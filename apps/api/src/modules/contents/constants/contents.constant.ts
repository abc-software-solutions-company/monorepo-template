import { createEntityField } from '@/common/utils/entity-field.util';

import { Content } from '../entities/content.entity';

const contentFields = createEntityField(Content, {
  fields: ['id', 'name', 'slug', 'description', 'body', 'status', 'type', 'seoMeta', 'createdAt', 'updatedAt'],
  alias: 'content',
});

export const CONTENT_GET_FIELDS = [...contentFields].flat().flatMap(item => item.trim().split(/\s+/));

export const CONTENT_FIELDS_TO_CREATE_OR_UPDATE = ['name', 'slug', 'description', 'body', 'type'] as const;

export enum CONTENT_STATUS {
  PUBLISHED = 'published',
  DRAFT = 'draft',
  DELETED = 'deleted',
}

export enum CONTENT_TYPE {
  UNCATEGORIZED = 'uncategorized',
}
