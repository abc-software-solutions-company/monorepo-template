import { Translation } from '@repo/shared-universal/interfaces/language.interface';
import { SeoMetadata } from '@repo/shared-universal/interfaces/metadata.interface';

import { ResponseFormat } from '@/interfaces/api-response.interface';
import { BaseFilter } from '@/interfaces/filter.interface';

import { PRODUCT_TYPE } from '../constants/products.constant';

import { UserEntity } from '@/modules/users/interfaces/users.interface';

export type ProductEntity = {
  id: string;
  name: string;
  slug: string;
  description: string;
  body: boolean;
  coverLocalized: Translation[];
  nameLocalized: Translation[];
  descriptionLocalized: Translation[];
  bodyLocalized: Translation[];
  seoMeta: SeoMetadata;
  createdAt: Date;
  updatedAt: Date;
  creator: UserEntity;
};

export type CreateProductDto = Omit<ProductEntity, 'id'>;
export type UpdateProductDto = Partial<CreateProductDto>;
export type ProductsResponse = ResponseFormat<ProductEntity[]>;
export type ProductResponse = ResponseFormat<ProductEntity>;
export type ProductFilter = BaseFilter & {
  type?: PRODUCT_TYPE;
};
