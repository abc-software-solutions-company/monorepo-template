import { Faq } from '../entities/faq.entity';

export const FAQ_GET_FIELDS = [['faq.id faq.titleLocalized faq.descriptionLocalized faq.status faq.createdAt']]
  .flat()
  .flatMap(item => item.trim().split(/\s+/));

export const FAQ_FIELDS_TO_CREATE_OR_UPDATE = ['titleLocalized', 'descriptionLocalized'] as (keyof Faq)[];

export enum FAQ_STATUS {
  PUBLISHED = 'published',
  DRAFT = 'draft',
  DELETED = 'deleted',
}
