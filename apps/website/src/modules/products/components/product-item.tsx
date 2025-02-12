'use client';

import React, { FC } from 'react';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import classNames from 'classnames';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/react-web-ui-shadcn/components/ui/avatar';
import { getShortName } from '@repo/shared-universal/utils/string.util';

import { Link } from '@/navigation';

import { ComponentBaseProps } from '@/interfaces/component.interface';
import { ProductEntity } from '../interfaces/products.interface';

import { IMAGE_BASE_URL } from '@/constants/file.constant';

import SanitizedHTML from '@/components/sanitized-html';

type ProductItemProps = {
  item: ProductEntity;
} & ComponentBaseProps;

const ProductItem: FC<ProductItemProps> = ({ className, item, ...rest }) => {
  const locale = useLocale();

  const name = item.nameLocalized?.find(x => x.lang === locale)?.value ?? '';
  const description = item.descriptionLocalized?.find(x => x.lang === locale)?.value ?? '';
  const cover = item.coverLocalized?.find(x => x.lang === locale)?.value ?? '';
  const category = item.category?.nameLocalized?.find(x => x.lang === locale)?.value;

  const shortName = getShortName(item.creator?.name);

  return (
    <div
      className={classNames('flex flex-col overflow-hidden rounded-lg bg-background transition-shadow duration-300 hover:shadow-lg', className)}
      data-testid="product-item"
      {...rest}
    >
      <div className="space-y-4">
        {category && (
          <div className="flex items-center space-x-2">
            <span className={classNames('rounded-md px-2 py-1 text-xs font-medium', 'bg-primary text-white')}>{category}</span>
          </div>
        )}
        <div>
          <Image src={IMAGE_BASE_URL + '/' + cover} alt={name} width={500} height={500} />
        </div>
        <Link href={{ pathname: '/product/[slug]', params: { slug: item.slug } }} className="block">
          <h2 className="text-xl font-semibold transition-colors hover:text-primary">{name}</h2>
        </Link>
        <SanitizedHTML className="line-clamp-2 text-muted-foreground" html={description} />
        {item.creator && (
          <div className="mt-4 flex items-center space-x-3">
            <div className="flex-shrink-0">
              <Avatar>
                <AvatarImage src={IMAGE_BASE_URL + item.creator?.avatar} alt={item.creator.name} />
                <AvatarFallback>{shortName}</AvatarFallback>
              </Avatar>
            </div>
            <div>
              <p className="text-sm font-medium">{item.creator.name}</p>
              <p className="text-sm text-muted-foreground">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductItem;
