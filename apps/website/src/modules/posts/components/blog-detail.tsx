import React, { FC } from 'react';
import classNames from 'classnames';

import { ComponentBaseProps } from '@/interfaces/component.interface';
import { PostEntity } from '../interfaces/posts.interface';

type BlogDetailProps = {
  item: PostEntity;
} & ComponentBaseProps;

const BlogDetail: FC<BlogDetailProps> = ({ className, item }) => {
  if (!item) return <>Something went wrong.</>;

  return (
    <div className={classNames(className)}>
      <h1 className="mb-6 text-center text-3xl font-bold md:text-4xl">{item.name}</h1>
      <div className="wysiwyg prose" dangerouslySetInnerHTML={{ __html: item.body ?? '' }} />
    </div>
  );
};

export default BlogDetail;
