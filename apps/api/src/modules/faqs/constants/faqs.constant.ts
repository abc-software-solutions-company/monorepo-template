import { createEntityField } from '@/common/utils/entity-field.util';

import { Faq } from '../entities/faq.entity';

const faqField = createEntityField(Faq, {
  fields: ['id', 'title', 'content', 'status', 'createdAt', 'updatedAt'],
  alias: 'faq',
});

export const FAQ_GET_FIELDS = [...faqField].flat().flatMap(item => item.trim().split(/\s+/));

export const FAQ_FIELDS_TO_CREATE_OR_UPDATE: (keyof Faq)[] = ['title', 'content'];

export enum FAQ_STATUS {
  PUBLISHED = 'published',
  DRAFT = 'draft',
  DELETED = 'deleted',
}
