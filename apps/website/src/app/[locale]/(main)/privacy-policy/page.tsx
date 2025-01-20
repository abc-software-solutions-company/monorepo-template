import { Metadata } from 'next';
import { LANGUAGES } from '@repo/shared-universal/constants/language.constant';

import { PageBaseProps } from '@/interfaces/page.interface';

import PostApi from '@/modules/posts/api/posts.api';
import PrivacyPolicy from '@/modules/posts/components/privacy-policy';
import { PostEntity } from '@/modules/posts/interfaces/posts.interface';

import { generateContentMetadata } from '@/utils/seo-metadata.util';

type PageProps = {
  params: {
    locale: string;
    slug: string;
  };
} & PageBaseProps;

export default async function PagePrivacyPolicy(_pageProps: PageBaseProps) {
  const response = await PostApi.getServerPost('privacy-policy');

  return (
    <div className="grow">
      <PrivacyPolicy item={response.data} />
    </div>
  );
}

export async function generateMetadata({ params: { locale, slug } }: PageProps): Promise<Metadata> {
  const response = await PostApi.getServerPost(slug);
  const baseMeta = generateContentMetadata<PostEntity>({ locale, data: response.data });

  const defaultLanguage = LANGUAGES.find(x => x.isDefault)?.code;

  const languages = LANGUAGES.reduce(
    (acc, lang) => {
      acc[lang.code] = lang.code === defaultLanguage ? `/privacy-policy` : `/${lang.code}/privacy-policy`;

      return acc;
    },
    {} as Record<string, string>
  );

  return {
    ...baseMeta,
    alternates: {
      canonical: locale === defaultLanguage ? `/privacy-policy` : `/${locale}/privacy-policy`,
      languages,
    },
  };
}
