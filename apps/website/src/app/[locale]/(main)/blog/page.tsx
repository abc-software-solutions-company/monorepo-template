import { Metadata } from 'next';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { PageBaseProps } from '@/interfaces/page.interface';

import PostApi from '@/modules/posts/api/posts.api';
import BlogRoot from '@/modules/posts/components/blog-root';
import { QUERY_POST_LIST } from '@/modules/posts/constants/posts.constant';
import { PostFilter } from '@/modules/posts/interfaces/posts.interface';

import { getQueryClient } from '@/utils/query-client.util';

const queryClient = getQueryClient();

export default async function BlogPage(pageProps: PageBaseProps) {
  const filter: PostFilter = {
    page: parseInt(pageProps.searchParams.page as string) || 1,
    limit: parseInt(pageProps.searchParams.limit as string) || 10,
  };

  await queryClient.prefetchQuery({
    queryKey: [QUERY_POST_LIST, filter],
    queryFn: async () => await PostApi.getServerPosts(filter),
  });

  return (
    <div className="grow">
      <div className="container">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <BlogRoot filter={filter} />
        </HydrationBoundary>
      </div>
    </div>
  );
}

export async function generateMetadata({ params: { locale } }: PageBaseProps): Promise<Metadata> {
  return {
    title: 'Blog',
    description: 'Blog Description',
    alternates: {
      canonical: `/${locale}/blog`,
    },
  };
}
