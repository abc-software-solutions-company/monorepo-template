import { Contact } from '../entities/contact.entity';

export const CONTACT_GET_FIELDS = [
  ['contact.id contact.name contact.email contact.subject contact.message contact.status contact.isRead contact.createdAt'],
]
  .flat()
  .flatMap(item => item.trim().split(/\s+/));

export const CONTACT_FIELDS_TO_CREATE_OR_UPDATE = ['name', 'email', 'subject', 'message'] as (keyof Contact)[];

export enum CONTACT_STATUS {
  PUBLISHED = 'published',
  READED = 'readed',
  DELETED = 'deleted',
}
