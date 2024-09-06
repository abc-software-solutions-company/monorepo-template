import { ResponseFormat } from '@/interfaces/api-response.interface';

export type ContentEntity = {
  id: string;
  name: string;
  slug: string;
  description: string;
  body: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type ContentResponse = ResponseFormat<ContentEntity>;
