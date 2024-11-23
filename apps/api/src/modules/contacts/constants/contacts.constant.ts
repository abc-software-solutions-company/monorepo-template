import { createEntityField } from '@/common/utils/entity-field.util';

import { Contact } from '../entities/contact.entity';

const contactFields = createEntityField(Contact, {
  fields: ['id', 'name', 'email', 'message', 'status', 'isRead', 'createdAt'],
  alias: 'contact',
});

export const CONTACT_GET_FIELDS = [...contactFields].flat().flatMap(item => item.trim().split(/\s+/));

export const CONTACT_FIELDS_TO_CREATE_OR_UPDATE = ['name', 'email', 'message'] as const;

export enum CONTACT_STATUS {
  VISIBLED = 'visibled',
  DELETED = 'deleted',
}
