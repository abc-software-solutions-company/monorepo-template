import { z } from 'zod';

import { ResponseFormat } from '@/interfaces/api-response.interface';
import { BaseFilter } from '@/interfaces/filter.interface';
import { SeoMeta } from '@/interfaces/seo-meta.interface';

import { PRODUCT_STATUS } from '../constants/products.constant';

import { CategoryEntity } from '@/modules/categories/interfaces/categories.interface';
import { FileEntity } from '@/modules/files/interfaces/files.interface';
import { UserEntity } from '@/modules/users/interfaces/users.interface';

import { productFormValidator } from '../validators/product-form.validator';

export type ProductEntity = {
  id: string;
  name: string;
  slug: string;
  description: string;
  body: string;
  status: PRODUCT_STATUS;
  creator: UserEntity;
  cover: string;
  images: FileEntity[];
  createdAt: string;
  updatedAt: string;
  category: CategoryEntity;
  seoMeta: SeoMeta;
};

export type ProductFormData = z.infer<typeof productFormValidator>;

export type ProductsResponse = ResponseFormat<ProductEntity[]>;
export type ProductResponse = ResponseFormat<ProductEntity>;

export type ProductFilter = BaseFilter;
