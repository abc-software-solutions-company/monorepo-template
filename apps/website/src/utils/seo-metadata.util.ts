/*
 * @Author: <Tin Tran> (tin.tran@abcdigital.io)
 * @Created: 2025-01-20 15:08:38
 */

import { Metadata } from 'next';
import { Translation } from '@repo/shared-universal/interfaces/language.interface';
import { SeoMetadata } from '@repo/shared-universal/interfaces/metadata.interface';
import { stripHTML } from '@repo/shared-universal/utils/string.util';

import { WEBSITE_OG_IMAGE } from '@/constants/site.constant';

type MetadataCreator = {
  name: string;
};

type BaseContentWithSEO = {
  nameLocalized?: Translation[];
  descriptionLocalized?: Translation[];
  coverLocalized?: Translation[];
  creator: MetadataCreator;
  createdAt: Date;
  seoMeta?: SeoMetadata;
};

type MetadataParams<T> = {
  locale: string;
  data: T;
};

export function generateContentMetadata<T extends BaseContentWithSEO>({ locale, data }: MetadataParams<T>): Metadata {
  const title = data?.nameLocalized?.find(x => x.lang === locale)?.value ?? '';
  const description = data?.descriptionLocalized?.find(x => x.lang === locale)?.value ?? '';
  const image = data?.coverLocalized?.find(x => x.lang === locale)?.value ?? '';

  const seoTitle = data?.seoMeta?.titleLocalized?.find(x => x.lang === locale)?.value ?? title;
  const seoDescription = data?.seoMeta?.descriptionLocalized?.find(x => x.lang === locale)?.value ?? stripHTML(description);
  const keywords = data?.seoMeta?.keywords ?? '';

  const creator = data?.creator?.name ?? 'Anonymous';
  const createdAt = data?.createdAt.toString();

  const ogImage = image ? `${process.env.NEXT_PUBLIC_API_URL}/${image}` : WEBSITE_OG_IMAGE;

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: keywords.split(', '),
    creator,
    authors: { name: creator },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      images: [{ url: ogImage, alt: seoTitle }],
      type: 'article',
      publishedTime: createdAt,
      authors: [creator],
    },
    twitter: {
      title: seoTitle,
      description: seoDescription,
      images: { url: ogImage, alt: seoTitle },
    },
  };
}
