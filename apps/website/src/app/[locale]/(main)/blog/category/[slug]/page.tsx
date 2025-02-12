import { Metadata } from 'next';
import { LANGUAGES } from '@repo/shared-universal/constants/language.constant';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { PageBaseProps } from '@/interfaces/page.interface';

import CategoryApi from '@/modules/categories/api/categories.api';
import { CategoryEntity } from '@/modules/categories/interfaces/categories.interface';
import PostApi from '@/modules/posts/api/posts.api';
import BlogRoot from '@/modules/posts/components/blog-root';
import { POST_TYPE, QUERY_POST_LIST } from '@/modules/posts/constants/posts.constant';
import { PostFilter } from '@/modules/posts/interfaces/posts.interface';

import { getQueryClient } from '@/utils/query-client.util';
import { generateContentMetadata } from '@/utils/seo-metadata.util';

const queryClient = getQueryClient();

type PageProps = {
  params: {
    locale: string;
    slug: string;
  };
} & PageBaseProps;

export default async function BlogCategoryPage(pageProps: PageProps) {
  const category = await CategoryApi.getServerCategoryBySlug(pageProps.params.slug);

  const filter: PostFilter = {
    page: parseInt(pageProps.searchParams.page as string) || 1,
    limit: parseInt(pageProps.searchParams.limit as string) || 5,
    q: (pageProps.searchParams.q as string) ?? '',
    year: parseInt(pageProps.searchParams.year as string) || undefined,
    categoryId: category.data.id,
    type: POST_TYPE.NEWS,
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

export async function generateMetadata({ params: { locale, slug } }: PageProps): Promise<Metadata> {
  const response = await CategoryApi.getServerCategoryBySlug(slug);

  const baseMeta = generateContentMetadata<CategoryEntity>({ locale, data: response.data });

  const defaultLanguage = LANGUAGES.find(x => x.isDefault)?.code;

  const languages = LANGUAGES.reduce(
    (acc, lang) => {
      acc[lang.code] = lang.code === defaultLanguage ? `/blog/category/${slug}` : `/${lang.code}/blog/category/${slug}`;

      return acc;
    },
    {} as Record<string, string>
  );

  return {
    ...baseMeta,
    alternates: {
      canonical: locale === defaultLanguage ? `/blog/category/${slug}` : `/${locale}/blog/category/${slug}`,
      languages,
    },
  };
}
