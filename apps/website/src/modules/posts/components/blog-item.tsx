import React, { FC } from 'react';
import classNames from 'classnames';

import { Link } from '@/navigation';

import { ComponentBaseProps } from '@/interfaces/component.interface';
import { PostEntity } from '../interfaces/posts.interface';

type BlogItemProps = {
  item: PostEntity;
} & ComponentBaseProps;

const BlogItem: FC<BlogItemProps> = ({ className, item, ...rest }) => {
  return (
    <div className={classNames('border', className)} data-testid="post-item" {...rest}>
      <h3>
        <Link href={{ pathname: '/blog/[slug]', params: { slug: item.slug } }}>{item.name}</Link>
      </h3>
      <div dangerouslySetInnerHTML={{ __html: item.description ?? '' }} />
    </div>
  );
};

export default BlogItem;
