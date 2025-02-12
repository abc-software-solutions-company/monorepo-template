import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LANGUAGES } from '@repo/shared-universal/constants/language.constant';

import { PageBaseProps } from '@/interfaces/page.interface';

import ProductApi from '@/modules/products/api/products.api';
import ProductDetail from '@/modules/products/components/product-detail';
import { PRODUCT_TYPE } from '@/modules/products/constants/products.constant';
import { ProductEntity } from '@/modules/products/interfaces/products.interface';

import { generateContentMetadata } from '@/utils/seo-metadata.util';

type PageProps = {
  params: {
    locale: string;
    slug: string;
  };
} & PageBaseProps;

export default async function ProductDetailPage(pageProps: PageProps) {
  const response = await ProductApi.getServerProduct(pageProps.params.slug);

  if (!response.data) notFound();

  return (
    <div className="grow">
      <div className="container">
        <ProductDetail item={response.data} />
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const productsResponse = await ProductApi.getServerProducts({ page: 1, limit: 30, type: PRODUCT_TYPE.DEFAULT });

  return productsResponse.data.map(product => ({ slug: product.slug }));
}

export async function generateMetadata({ params: { locale, slug } }: PageProps): Promise<Metadata> {
  const response = await ProductApi.getServerProduct(slug);
  const baseMeta = generateContentMetadata<ProductEntity>({ locale, data: response.data });

  const defaultLanguage = LANGUAGES.find(x => x.isDefault)?.code;

  const languages = LANGUAGES.reduce(
    (acc, lang) => {
      acc[lang.code] = lang.code === defaultLanguage ? `/product/${slug}` : `/${lang.code}/product/${slug}`;

      return acc;
    },
    {} as Record<string, string>
  );

  return {
    ...baseMeta,
    alternates: {
      canonical: locale === defaultLanguage ? `/product/${slug}` : `/${locale}/product/${slug}`,
      languages,
    },
  };
}
