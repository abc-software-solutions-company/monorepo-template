import React from 'react';
import { Metadata } from 'next';

import { PageBaseProps } from '@/interfaces/page.interface';

import PostApi from '@/modules/posts/api/posts.api';
import BlogDetail from '@/modules/posts/components/blog-detail';

type PageProps = {
  params: {
    locale: string;
    slug: string;
  };
} & PageBaseProps;

export default async function PostDetailPage(pageProps: PageProps) {
  const response = await PostApi.getServerPost(pageProps.params.slug);

  return (
    <div className="grow">
      <div className="container">
        <BlogDetail item={response.data} />
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const postsResponse = await PostApi.getServerPosts({ page: 1, limit: 30 });

  return postsResponse.data.map(post => ({ slug: post.slug }));
}

export async function generateMetadata({ params: { locale, slug } }: PageProps): Promise<Metadata> {
  const response = await PostApi.getServerPost(slug);

  return {
    title: response.data?.name,
    description: response.data?.description,
    alternates: {
      canonical: `/${locale}/${slug}`,
    },
  };
}
