import { ContactFormData, CreateContactResponse } from '../interfaces/contacts.interface';

import { API_ENDPOINTS } from '@/constants/api-endpoint.constant';

import axiosClient from '@/http/http-request';

export const create = (createDto: ContactFormData) => {
  return axiosClient.post<CreateContactResponse>(API_ENDPOINTS.CONTACTS, createDto);
};

const ContactApi = { create };

export default ContactApi;
