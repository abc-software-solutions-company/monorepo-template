'use client';

import React, { FC } from 'react';
import { useLocale } from 'next-intl';
import classNames from 'classnames';
import { Loading } from '@repo/react-web-ui-shadcn/components/ui/loading';
import { useQuery } from '@tanstack/react-query';

import { Link } from '@/navigation';

import { ComponentBaseProps } from '@/interfaces/component.interface';

import { CATEGORY_TYPE, QUERY_CATEGORY_BY_TYPE } from '../constants/categories.constant';

import CategoryApi from '../api/categories.api';

type CategoryListProps = {
  type: CATEGORY_TYPE;
} & ComponentBaseProps;

const CategoryListByType: FC<CategoryListProps> = ({ className, type, ...rest }) => {
  const locale = useLocale();

  const { data } = useQuery({
    queryKey: [QUERY_CATEGORY_BY_TYPE, type],
    queryFn: async () => await CategoryApi.getServerCategoriesByType(type),
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

export default CategoryListByType;
