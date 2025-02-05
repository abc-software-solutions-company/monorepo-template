'use client';

import React, { FC } from 'react';
import classNames from 'classnames';
import { Loading } from '@repo/react-web-ui-shadcn/components/ui/loading';
import Pagination from '@repo/react-web-ui-shadcn/components/ui/pagination-custom';
import { useQuery } from '@tanstack/react-query';

import { useRouter } from '@/navigation';

import { ComponentBaseProps } from '@/interfaces/component.interface';
import { PostFilter } from '../interfaces/posts.interface';

import { QUERY_POST_LIST } from '../constants/posts.constant';

import BlogList from './blog-list';

import PostApi from '../api/posts.api';

type BlogRootProps = {
  filter: PostFilter;
} & ComponentBaseProps;

const BlogRoot: FC<BlogRootProps> = ({ className, filter }) => {
  const router = useRouter();

  const { data } = useQuery({
    queryKey: [QUERY_POST_LIST, filter],
    queryFn: async () => await PostApi.getServerPosts(filter),
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
        <BlogList items={data.data} />
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

export default BlogRoot;
