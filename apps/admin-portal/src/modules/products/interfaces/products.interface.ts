import { z } from 'zod';
import { LANGUAGES } from '@repo/shared-universal/constants/language.constant';
import { Translation } from '@repo/shared-universal/interfaces/language.interface';

import { ResponseFormat } from '@/interfaces/api-response.interface';
import { BaseFilter } from '@/interfaces/filter.interface';
import { SeoMeta } from '@/interfaces/seo-meta.interface';

import { PRODUCT_STATUS, PRODUCT_TYPE } from '../constants/products.constant';

import { CategoryEntity } from '@/modules/categories/interfaces/categories.interface';
import { FileEntity } from '@/modules/files/interfaces/files.interface';
import { UserEntity } from '@/modules/users/interfaces/users.interface';

import { productFormLocalizeSchema } from '../validators/product-form.validator';

export type ProductEntity = {
  id: string;
  slug: string;
  type: PRODUCT_TYPE;
  status: PRODUCT_STATUS;
  publishDate: string;
  externalUrl: string;
  coverLocalized: Translation[];
  nameLocalized: Translation[];
  descriptionLocalized: Translation[];
  bodyLocalized: Translation[];
  creator: UserEntity;
  category: CategoryEntity;
  images: FileEntity[];
  seoMeta: SeoMeta;
  createdAt: string;
  updatedAt: string;
};

const schema = productFormLocalizeSchema(LANGUAGES);

export type ProductFormData = z.infer<typeof schema>;
export type ProductsResponse = ResponseFormat<ProductEntity[]>;
export type ProductResponse = ResponseFormat<ProductEntity>;
export type BulkDeleteProductResponse = ProductResponse;
export type ProductFilter = BaseFilter & {
  type?: PRODUCT_TYPE;
};
