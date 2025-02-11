'use client';

import React, { FC } from 'react';
import { useParams } from 'next/navigation';
import classNames from 'classnames';
import { Loading } from '@repo/react-web-ui-shadcn/components/ui/loading';
import Pagination from '@repo/react-web-ui-shadcn/components/ui/pagination-custom';
import { useQuery } from '@tanstack/react-query';

import { usePathname, useRouter } from '@/navigation';

import { ComponentBaseProps } from '@/interfaces/component.interface';
import { PostFilter } from '../interfaces/posts.interface';

import { QUERY_POST_LIST } from '../constants/posts.constant';

import CategoryListByType from '@/modules/categories/components/category-list-by-type';
import { CATEGORY_TYPE } from '@/modules/categories/constants/categories.constant';

import BlogList from './blog-list';

import PostApi from '../api/posts.api';

type BlogRootProps = {
  filter: PostFilter;
} & ComponentBaseProps;

const BlogRoot: FC<BlogRootProps> = ({ className, filter }) => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams<{ slug: string }>();

  const isCategoryPage = pathname.includes('/category');

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_POST_LIST, filter],
    queryFn: async () => await PostApi.getServerPosts(filter),
    staleTime: 0,
  });

  if (isLoading || !data) {
    return (
      <div className="container">
        <div className="flex items-center justify-center p-3">
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <div className={classNames('w-full', className)}>
      <div className="container">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr,300px]">
          <div>
            <BlogList items={data.data} />
            <div className="mt-12 flex justify-center">
              <Pagination
                className="text-center"
                totalItems={data.meta?.paging?.totalItems}
                currentPage={data.meta?.paging?.currentPage}
                itemPerPage={data.meta?.paging?.itemsPerPage}
                onChange={page => {
                  if (isCategoryPage) {
                    router.push({
                      pathname: '/blog/category/[slug]',
                      params: { slug: params.slug },
                      query: { page },
                    });
                  } else {
                    router.push({
                      pathname: '/blog',
                      query: { page },
                    });
                  }
                }}
              />
            </div>
          </div>
          <div>
            <CategoryListByType type={CATEGORY_TYPE.NEWS} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogRoot;
