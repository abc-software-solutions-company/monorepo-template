import { Metadata } from 'next';
import { LANGUAGES } from '@repo/shared-universal/constants/language.constant';

import { PageBaseProps } from '@/interfaces/page.interface';

import PostApi from '@/modules/posts/api/posts.api';
import TermsAndConditions from '@/modules/posts/components/terms-and-conditions';
import { PostEntity } from '@/modules/posts/interfaces/posts.interface';

import { generateContentMetadata } from '@/utils/seo-metadata.util';

type PageProps = {
  params: {
    locale: string;
    slug: string;
  };
} & PageBaseProps;

export default async function PageTermsAndConditions(_pageProps: PageProps) {
  const response = await PostApi.getServerPost('terms-and-conditions');

  return (
    <div className="grow">
      <TermsAndConditions item={response.data} />
    </div>
  );
}

export async function generateMetadata({ params: { locale, slug } }: PageProps): Promise<Metadata> {
  const response = await PostApi.getServerPost(slug);
  const baseMeta = generateContentMetadata<PostEntity>({ locale, data: response.data });

  const defaultLanguage = LANGUAGES.find(x => x.isDefault)?.code;

  const languages = LANGUAGES.reduce(
    (acc, lang) => {
      acc[lang.code] = lang.code === defaultLanguage ? `/terms-and-conditions` : `/${lang.code}/terms-and-conditions`;

      return acc;
    },
    {} as Record<string, string>
  );

  return {
    ...baseMeta,
    alternates: {
      canonical: locale === defaultLanguage ? `/terms-and-conditions` : `/${locale}/terms-and-conditions`,
      languages,
    },
  };
}
