import { z } from 'zod';

import { ResponseFormat } from '@/interfaces/api-response.interface';

import { contactFormSchema } from '../validators/create-contact.validator';

export type ContactFormData = z.infer<typeof contactFormSchema>;

export type CreateContactResponse = ResponseFormat<unknown>;
