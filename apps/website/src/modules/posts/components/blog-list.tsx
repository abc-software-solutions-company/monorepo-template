'use client';

import React, { FC } from 'react';
import classNames from 'classnames';

import { ComponentBaseProps } from '@/interfaces/component.interface';
import { PostEntity } from '../interfaces/posts.interface';

import BlogItem from './blog-item';

type BlogListProps = {
  items: PostEntity[];
} & ComponentBaseProps;

const BlogList: FC<BlogListProps> = ({ className, items, ...rest }) => {
  return (
    <div className={classNames('grid gap-6', className)} {...rest}>
      {items?.map(item => <BlogItem key={item.id} item={item} />)}
    </div>
  );
};

export default BlogList;
