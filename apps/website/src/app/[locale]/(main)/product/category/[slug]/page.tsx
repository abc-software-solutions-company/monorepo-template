import { Metadata } from 'next';
import { LANGUAGES } from '@repo/shared-universal/constants/language.constant';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { PageBaseProps } from '@/interfaces/page.interface';

import CategoryApi from '@/modules/categories/api/categories.api';
import { CategoryEntity } from '@/modules/categories/interfaces/categories.interface';
import ProductApi from '@/modules/products/api/products.api';
import ProductRoot from '@/modules/products/components/product-root';
import { PRODUCT_TYPE, QUERY_PRODUCT_LIST } from '@/modules/products/constants/products.constant';
import { ProductFilter } from '@/modules/products/interfaces/products.interface';

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

  const filter: ProductFilter = {
    page: parseInt(pageProps.searchParams.page as string) || 1,
    limit: parseInt(pageProps.searchParams.limit as string) || 5,
    q: (pageProps.searchParams.q as string) ?? '',
    year: parseInt(pageProps.searchParams.year as string) || undefined,
    categoryId: category.data.id,
    type: PRODUCT_TYPE.DEFAULT,
  };

  await queryClient.prefetchQuery({
    queryKey: [QUERY_PRODUCT_LIST, filter],
    queryFn: async () => await ProductApi.getServerProducts(filter),
  });

  return (
    <div className="grow">
      <div className="container">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <ProductRoot filter={filter} />
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
      acc[lang.code] = lang.code === defaultLanguage ? `/product/category/${slug}` : `/${lang.code}/product/category/${slug}`;

      return acc;
    },
    {} as Record<string, string>
  );

  return {
    ...baseMeta,
    alternates: {
      canonical: locale === defaultLanguage ? `/product/category/${slug}` : `/${locale}/product/category/${slug}`,
      languages,
    },
  };
}
