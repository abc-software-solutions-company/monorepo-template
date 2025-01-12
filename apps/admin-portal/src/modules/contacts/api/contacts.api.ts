import { EntityId } from '@reduxjs/toolkit';
import { objectToQueryString } from '@repo/shared-universal/utils/string.util';

import { ContactFilter, ContactResponse, ContactsResponse } from '../interfaces/contacts.interface';

import { API_ENDPOINTS } from '@/constants/api-endpoint.constant';

import axiosClient from '@/http/http-request';

export const list = (filter: ContactFilter) => {
  const url = API_ENDPOINTS.CONTACTS + '?' + objectToQueryString(filter);

  return axiosClient.get<ContactsResponse>(url);
};

export const read = (id: EntityId) => {
  return axiosClient.get<ContactResponse>(`${API_ENDPOINTS.CONTACTS}/${id}`);
};

const ContactApi = { list, read };

export default ContactApi;
