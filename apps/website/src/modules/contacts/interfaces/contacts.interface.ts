import { ResponseFormat } from '@/interfaces/api-response.interface';

export type ContactFormData = {
  name: string;
  email: string;
  message: string;
};

export type CreateContactResponse = ResponseFormat<unknown>;
