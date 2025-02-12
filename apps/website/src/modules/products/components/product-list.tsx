'use client';

import React, { FC } from 'react';
import classNames from 'classnames';

import { ComponentBaseProps } from '@/interfaces/component.interface';
import { ProductEntity } from '../interfaces/products.interface';

import ProductItem from './product-item';

type ProductListProps = {
  items: ProductEntity[];
} & ComponentBaseProps;

const ProductList: FC<ProductListProps> = ({ className, items, ...rest }) => {
  return (
    <div className={classNames('grid grid-cols-4 gap-6', className)} {...rest}>
      {items?.map(item => <ProductItem key={item.id} item={item} />)}
    </div>
  );
};

export default ProductList;
