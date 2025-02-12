'use client';

import React, { FC, useState } from 'react';
import { useParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { Button } from '@repo/react-web-ui-shadcn/components/ui/button';
import { Input } from '@repo/react-web-ui-shadcn/components/ui/input';
import { Loading } from '@repo/react-web-ui-shadcn/components/ui/loading';
import Pagination from '@repo/react-web-ui-shadcn/components/ui/pagination-custom';
import { cn } from '@repo/react-web-ui-shadcn/lib/utils';
import { useQuery } from '@tanstack/react-query';

import { usePathname, useRouter } from '@/navigation';

import { ComponentBaseProps } from '@/interfaces/component.interface';
import { ProductFilter } from '../interfaces/products.interface';

import { QUERY_PRODUCT_LIST } from '../constants/products.constant';

import { CATEGORY_TYPE } from '@/modules/categories/constants/categories.constant';

import ProductCategoryList from './product-category-list';
import BlogList from './product-list';

import ProductApi from '../api/products.api';

type ProductRootProps = {
  filter: ProductFilter;
} & ComponentBaseProps;

const ProductRoot: FC<ProductRootProps> = ({ className, filter }) => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams<{ slug: string }>();
  const [searchTerm, setSearchTerm] = useState(filter.q || '');

  const isCategoryPage = pathname.includes('/category');

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_PRODUCT_LIST, filter],
    queryFn: async () => await ProductApi.getServerProducts(filter),
    staleTime: 0,
  });

  const handleSearch = () => {
    const query = { page: 1 } as ProductFilter;

    if (searchTerm) query.q = searchTerm;
    if (filter.year) query.year = filter.year;

    if (isCategoryPage) {
      router.push({ pathname: '/product/category/[slug]', params: { slug: params.slug }, query });
    } else {
      router.push({ pathname: '/product', query });
    }
  };

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center p-3">
        <Loading />
      </div>
    );
  }

  return (
    <div className={cn(className)}>
      <div className="relative mx-auto mb-12 flex max-w-xl gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
        </div>
        <Button type="button" onClick={handleSearch}>
          Search
        </Button>
      </div>
      <div className="grid grid-cols-[1fr,300px] gap-8">
        <div>
          {data.data.length > 0 ? (
            <>
              <BlogList items={data.data} />
              <div className="my-12 flex justify-center">
                <Pagination
                  className="text-center"
                  totalItems={data.meta?.paging?.totalItems}
                  currentPage={data.meta?.paging?.currentPage}
                  itemPerPage={data.meta?.paging?.itemsPerPage}
                  onChange={page => {
                    const query = { page } as ProductFilter;

                    if (searchTerm) query.q = searchTerm;
                    if (filter.year) query.year = filter.year;

                    if (isCategoryPage) {
                      router.push({ pathname: '/product/category/[slug]', params: { slug: params.slug }, query });
                    } else {
                      router.push({ pathname: '/product', query });
                    }
                  }}
                />
              </div>
            </>
          ) : (
            <div className="py-8 text-center">
              <h3 className="text-lg font-medium">No products found</h3>
            </div>
          )}
        </div>
        <div className="space-y-8">
          <ProductCategoryList currentCategory={params.slug} type={CATEGORY_TYPE.PRODUCT} />
        </div>
      </div>
    </div>
  );
};

export default ProductRoot;
