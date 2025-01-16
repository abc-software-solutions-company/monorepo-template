import React, { FC, useEffect, useState } from 'react';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import classNames from 'classnames';

import { Link } from '@/navigation';

import { ComponentBaseProps } from '@/interfaces/component.interface';
import { PostEntity } from '../interfaces/posts.interface';

import { FILE_PATH } from '@/constants/file.constant';
import { WEBSITE_OG_IMAGE } from '@/constants/site.constant';

type BlogItemProps = {
  item: PostEntity;
} & ComponentBaseProps;

const BlogItem: FC<BlogItemProps> = ({ className, item, ...rest }) => {
  const locale = useLocale();
  const [imgSrc, setImgSrc] = useState<string>(WEBSITE_OG_IMAGE);

  const name = item.nameLocalized?.find(x => x.lang === locale)?.value ?? '';
  const description = item.descriptionLocalized?.find(x => x.lang === locale)?.value ?? '';
  const image = item.coverLocalized?.find(x => x.lang === locale)?.value ?? '';

  useEffect(() => {
    if (image) {
      setImgSrc(`${FILE_PATH}/${image}`);
    }
  }, [image]);

  return (
    <div className={classNames('flex gap-2 border', className)} data-testid="post-item" {...rest}>
      <div className="shrink-0">
        <Image
          src={imgSrc}
          alt={name}
          width={300}
          height={200}
          className="aspect-video rounded-lg object-cover"
          onError={() => setImgSrc(WEBSITE_OG_IMAGE)}
        />
      </div>
      <div className="grow">
        <h3>
          <b>
            <Link href={{ pathname: '/blog/[slug]', params: { slug: item.slug } }}>{name}</Link>
          </b>
        </h3>
        <div dangerouslySetInnerHTML={{ __html: description ?? '' }} />
      </div>
    </div>
  );
};

export default BlogItem;
