'use client';

import React, { FC } from 'react';
import { useLocale } from 'next-intl';
import classNames from 'classnames';

import { ComponentBaseProps } from '@/interfaces/component.interface';
import { ProductEntity } from '../interfaces/products.interface';

import SanitizedHTML from '@/components/sanitized-html';

type ProductDetailProps = {
  item: ProductEntity;
} & ComponentBaseProps;

const ProductDetail: FC<ProductDetailProps> = ({ className, item }) => {
  const locale = useLocale();

  const name = item.nameLocalized?.find(x => x.lang === locale)?.value ?? '';
  const body = item.bodyLocalized?.find(x => x.lang === locale)?.value ?? '';

  if (!item) return <>Something went wrong.</>;

  return (
    <div className={classNames(className)}>
      <h1 className="mb-6 text-center text-3xl font-bold md:text-4xl">{name}</h1>
      <SanitizedHTML html={body} />
    </div>
  );
};

export default ProductDetail;
