'use client';

import React, { FC } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Loading } from '@repo/react-web-ui-shadcn/components/ui/loading';
import { cn } from '@repo/react-web-ui-shadcn/lib/utils';
import { useQuery } from '@tanstack/react-query';

import { useRouter } from '@/navigation';

import { ComponentBaseProps } from '@/interfaces/component.interface';

import CategoryApi from '@/modules/categories/api/categories.api';
import { CATEGORY_TYPE, QUERY_CATEGORY_BY_TYPE } from '@/modules/categories/constants/categories.constant';
import { PostFilter } from '@/modules/posts/interfaces/posts.interface';

type PostCategoryListProps = {
  type: CATEGORY_TYPE;
  currentCategory: string;
} & ComponentBaseProps;

const PostCategoryList: FC<PostCategoryListProps> = ({ className, type, currentCategory }) => {
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data } = useQuery({
    queryKey: [QUERY_CATEGORY_BY_TYPE, type],
    queryFn: async () => await CategoryApi.getServerCategoriesByType(type),
  });

  const handleClick = (slug: string | undefined) => {
    const query = { page: 1 } as PostFilter;

    if (searchParams.get('q')) query.q = searchParams.get('q') as string;
    if (searchParams.get('year')) query.year = parseInt(searchParams.get('year') as string, 10);
    if (slug) {
      router.push({ pathname: '/blog/category/[slug]', params: { slug: slug as string }, query });
    } else {
      router.push({ pathname: '/blog', query });
    }
  };

  if (!data) {
    return (
      <div className="container">
        <div className="flex items-center justify-center p-3">
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <div className={cn(className)}>
      <h3 className="py-4 text-2xl font-semibold">Categories</h3>
      <div className="grid gap-2">
        <button className={cn('text-left', currentCategory === undefined && 'text-primary')} onClick={() => handleClick(undefined)}>
          All categories
        </button>
        {data.data?.map(item => {
          const query = { page: 1 } as PostFilter;

          if (searchParams.get('q')) query.q = searchParams.get('q') as string;
          if (searchParams.get('year')) query.year = parseInt(searchParams.get('year') as string, 10);

          const name = item.nameLocalized?.find(x => x.lang === locale)?.value ?? '';

          return (
            <button
              key={item.id}
              data-testid="category-item"
              className={cn('text-left', item.slug === currentCategory && 'text-primary')}
              onClick={() => handleClick(item.slug)}
            >
              {name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PostCategoryList;
