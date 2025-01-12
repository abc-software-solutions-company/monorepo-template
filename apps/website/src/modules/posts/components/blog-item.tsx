import React, { FC } from 'react';
import { useLocale } from 'next-intl';
import classNames from 'classnames';

import { Link } from '@/navigation';

import { ComponentBaseProps } from '@/interfaces/component.interface';
import { PostEntity } from '../interfaces/posts.interface';

type BlogItemProps = {
  item: PostEntity;
} & ComponentBaseProps;

const BlogItem: FC<BlogItemProps> = ({ className, item, ...rest }) => {
  const locale = useLocale();

  const name = item.nameLocalized?.find(x => x.lang === locale)?.value ?? '';
  const description = item.descriptionLocalized?.find(x => x.lang === locale)?.value ?? '';

  return (
    <div className={classNames('border', className)} data-testid="post-item" {...rest}>
      <h3>
        <Link href={{ pathname: '/blog/[slug]', params: { slug: item.slug } }}>{name}</Link>
      </h3>
      <div dangerouslySetInnerHTML={{ __html: description ?? '' }} />
    </div>
  );
};

export default BlogItem;
