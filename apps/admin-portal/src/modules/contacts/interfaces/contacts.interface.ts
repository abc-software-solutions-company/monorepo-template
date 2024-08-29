import { ResponseFormat } from '@/interfaces/api-response.interface';
import { BaseFilter } from '@/interfaces/filter.interface';

import { CONTACT_STATUS } from '../constants/contacts.constant';

export type ContactEntity = {
  id: string;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  status: CONTACT_STATUS;
  createdAt: string;
  updatedAt: string;
};

export type ContactFormData = {
  name: string;
  email: string;
  message: string;
};

export type ContactsResponse = ResponseFormat<ContactEntity[]>;
export type ContactResponse = ResponseFormat<ContactEntity>;
export type BulkDeleteContactResponse = ContactResponse;

export type ContactFilter = BaseFilter;
