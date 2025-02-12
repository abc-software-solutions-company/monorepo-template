import { Metadata } from 'next';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { PageBaseProps } from '@/interfaces/page.interface';

import ProductApi from '@/modules/products/api/products.api';
import ProductRoot from '@/modules/products/components/product-root';
import { PRODUCT_TYPE, QUERY_PRODUCT_LIST } from '@/modules/products/constants/products.constant';
import { ProductFilter } from '@/modules/products/interfaces/products.interface';

import { getQueryClient } from '@/utils/query-client.util';

const queryClient = getQueryClient();

type PageProps = {
  params: {
    locale: string;
    slug: string;
  };
} & PageBaseProps;

export default async function BlogPage(pageProps: PageProps) {
  const filter: ProductFilter = {
    page: parseInt(pageProps.searchParams.page as string) || 1,
    limit: parseInt(pageProps.searchParams.limit as string) || 5,
    q: (pageProps.searchParams.q as string) ?? '',
    year: parseInt(pageProps.searchParams.year as string) || undefined,
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

export async function generateMetadata({ params: { locale } }: PageBaseProps): Promise<Metadata> {
  return {
    title: 'Product',
    description: 'Product Description',
    alternates: {
      canonical: `/${locale}/product`,
    },
  };
}
