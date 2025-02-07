import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LANGUAGES } from '@repo/shared-universal/constants/language.constant';

import { PageBaseProps } from '@/interfaces/page.interface';

import PostApi from '@/modules/posts/api/posts.api';
import BlogDetail from '@/modules/posts/components/blog-detail';
import { POST_TYPE } from '@/modules/posts/constants/posts.constant';
import { PostEntity } from '@/modules/posts/interfaces/posts.interface';

import { generateContentMetadata } from '@/utils/seo-metadata.util';

type PageProps = {
  params: {
    locale: string;
    slug: string;
  };
} & PageBaseProps;

export default async function PostDetailPage(pageProps: PageProps) {
  const response = await PostApi.getServerPost(pageProps.params.slug);

  if (!response.data) notFound();

  return (
    <div className="grow">
      <div className="container">
        <BlogDetail item={response.data} />
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const postsResponse = await PostApi.getServerPosts({ page: 1, limit: 30, type: POST_TYPE.NEWS });

  return postsResponse.data.map(post => ({ slug: post.slug }));
}

export async function generateMetadata({ params: { locale, slug } }: PageProps): Promise<Metadata> {
  const response = await PostApi.getServerPost(slug);
  const baseMeta = generateContentMetadata<PostEntity>({ locale, data: response.data });

  const defaultLanguage = LANGUAGES.find(x => x.isDefault)?.code;

  const languages = LANGUAGES.reduce(
    (acc, lang) => {
      acc[lang.code] = lang.code === defaultLanguage ? `/blog/${slug}` : `/${lang.code}/blog/${slug}`;

      return acc;
    },
    {} as Record<string, string>
  );

  return {
    ...baseMeta,
    alternates: {
      canonical: locale === defaultLanguage ? `/blog/${slug}` : `/${locale}/blog/${slug}`,
      languages,
    },
  };
}
