import { Metadata } from 'next';
import { LANGUAGES } from '@repo/shared-universal/constants/language.constant';

import { PageBaseProps } from '@/interfaces/page.interface';

import PostApi from '@/modules/posts/api/posts.api';
import AboutUs from '@/modules/posts/components/about-us';
import { PostEntity } from '@/modules/posts/interfaces/posts.interface';

import { generateContentMetadata } from '@/utils/seo-metadata.util';

type PageProps = {
  params: {
    locale: string;
    slug: string;
  };
} & PageBaseProps;

export default async function PageAboutUs(_pageProps: PageBaseProps) {
  const response = await PostApi.getServerPost('about-us');

  return (
    <div className="grow">
      <AboutUs item={response.data} />
    </div>
  );
}

export async function generateMetadata({ params: { locale, slug } }: PageProps): Promise<Metadata> {
  const response = await PostApi.getServerPost(slug);
  const baseMeta = generateContentMetadata<PostEntity>({ locale, data: response.data });

  const defaultLanguage = LANGUAGES.find(x => x.isDefault)?.code;

  const languages = LANGUAGES.reduce(
    (acc, lang) => {
      acc[lang.code] = lang.code === defaultLanguage ? `about-us` : `/${lang.code}about-us`;

      return acc;
    },
    {} as Record<string, string>
  );

  return {
    ...baseMeta,
    alternates: {
      canonical: locale === defaultLanguage ? `about-us` : `/${locale}about-us`,
      languages,
    },
  };
}
