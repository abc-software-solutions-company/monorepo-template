'use client';

import React, { FC } from 'react';
import classNames from 'classnames';
import { Loading } from '@repo/react-web-ui-shadcn/components/ui/loading';
import Pagination from '@repo/react-web-ui-shadcn/components/ui/pagination-custom';
import { useQuery } from '@tanstack/react-query';

import { useRouter } from '@/navigation';

import { ComponentBaseProps } from '@/interfaces/component.interface';
import { ProductFilter } from '../interfaces/products.interface';

import { QUERY_PRODUCT_LIST } from '../constants/products.constant';

import ProductList from './product-list';

import ProductApi from '../api/products.api';

type ProductRootProps = {
  filter: ProductFilter;
} & ComponentBaseProps;

const ProductRoot: FC<ProductRootProps> = ({ className, filter }) => {
  const router = useRouter();

  const { data } = useQuery({
    queryKey: [QUERY_PRODUCT_LIST, filter],
    queryFn: async () => await ProductApi.getServerProducts(filter),
  });

  if (!data)
    return (
      <div className="container">
        <div className="flex items-center justify-center p-3">
          <Loading />
        </div>
      </div>
    );

  return (
    <div className={classNames(className)}>
      <div className="container">
        <ProductList items={data.data} />
        <div className="mt-12 flex justify-center">
          <Pagination
            className="text-center"
            totalItems={data.meta?.paging?.totalItems}
            currentPage={data.meta?.paging?.currentPage}
            itemPerPage={data.meta?.paging?.itemsPerPage}
            onChange={page => router.push({ pathname: '/blog', query: { page } })}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductRoot;
