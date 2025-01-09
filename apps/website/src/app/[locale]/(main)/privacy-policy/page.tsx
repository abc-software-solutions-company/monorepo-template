import { Metadata } from 'next';

import { LayoutProps } from '@/interfaces/layout.interface';
import { PageBaseProps } from '@/interfaces/page.interface';

import PrivacyPolicyApi from '@/modules/contents/api/contents.api';
import PrivacyPolicy from '@/modules/contents/components/privacy-policy';

export default async function PagePrivacyPolicy(_pageProps: PageBaseProps) {
  const response = await PrivacyPolicyApi.getServerContentBySlug('privacy-policy');

  return (
    <div className="grow">
      <PrivacyPolicy data={response.data} />
    </div>
  );
}

export async function generateMetadata({ params: { locale } }: LayoutProps): Promise<Metadata> {
  return {
    title: 'Privacy Policy',
    description: 'Privacy Policy Description',
    alternates: {
      canonical: `/${locale}/privacy-policy`,
    },
  };
}
