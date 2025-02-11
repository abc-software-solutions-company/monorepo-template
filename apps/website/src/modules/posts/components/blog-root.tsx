'use client';

import React, { FC, useCallback, useState } from 'react';
import { useParams } from 'next/navigation';
import classNames from 'classnames';
import { Search } from 'lucide-react';
import { Button } from '@repo/react-web-ui-shadcn/components/ui/button';
import { Input } from '@repo/react-web-ui-shadcn/components/ui/input';
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
  const [searchTerm, setSearchTerm] = useState(filter.q || '');

  const isCategoryPage = pathname.includes('/category');

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_POST_LIST, filter],
    queryFn: async () => await PostApi.getServerPosts(filter),
    staleTime: 0,
  });

  const handleSubmit = useCallback(() => {
    const query = { page: 1 } as PostFilter;

    if (searchTerm) query.q = searchTerm;

    if (isCategoryPage) {
      router.push({ pathname: '/blog/category/[slug]', params: { slug: params.slug }, query });
    } else {
      router.push({ pathname: '/blog', query });
    }
  }, [searchTerm, isCategoryPage, router, params]);

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
        <div className="mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search posts..." className="pl-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <Button type="button" onClick={handleSubmit}>
            Search
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr,300px]">
          <div>
            {data.data.length > 0 ? (
              <>
                <BlogList items={data.data} />
                <div className="mt-12 flex justify-center">
                  <Pagination
                    className="text-center"
                    totalItems={data.meta?.paging?.totalItems}
                    currentPage={data.meta?.paging?.currentPage}
                    itemPerPage={data.meta?.paging?.itemsPerPage}
                    onChange={page => {
                      const query = { page } as PostFilter;

                      if (searchTerm) query.q = searchTerm;

                      if (isCategoryPage) {
                        router.push({ pathname: '/blog/category/[slug]', params: { slug: params.slug }, query });
                      } else {
                        router.push({ pathname: '/blog', query });
                      }
                    }}
                  />
                </div>
              </>
            ) : (
              <div className="py-8 text-center">
                <h3 className="text-lg font-medium">No posts found</h3>
                <p className="mt-2 text-muted-foreground">Try adjusting your search terms</p>
              </div>
            )}
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
