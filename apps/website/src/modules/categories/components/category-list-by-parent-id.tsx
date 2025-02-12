'use client';

import React, { FC } from 'react';
import { useLocale } from 'next-intl';
import classNames from 'classnames';
import { Loading } from '@repo/react-web-ui-shadcn/components/ui/loading';
import { useQuery } from '@tanstack/react-query';

import { Link } from '@/navigation';

import { ComponentBaseProps } from '@/interfaces/component.interface';

import { QUERY_CATEGORY_LIST_BY_PARENT_ID } from '../constants/categories.constant';

import CategoryApi from '../api/categories.api';

type CategoryListProps = {
  id: string;
} & ComponentBaseProps;

const CategoryListByParentId: FC<CategoryListProps> = ({ className, id, ...rest }) => {
  const locale = useLocale();

  const { data } = useQuery({
    queryKey: [QUERY_CATEGORY_LIST_BY_PARENT_ID, id],
    queryFn: async () => await CategoryApi.getServerCategoriesByParentId(id),
  });

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
    <div className={classNames('grid gap-3', className)} {...rest}>
      <ul>
        {data.data?.map(item => {
          const name = item.nameLocalized?.find(x => x.lang === locale)?.value ?? '';

          return (
            <li key={item.id} className={classNames('border')} data-testid="category-item">
              <Link href={{ pathname: '/blog/category/[slug]', params: { slug: item.slug } }}>{name}</Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CategoryListByParentId;
