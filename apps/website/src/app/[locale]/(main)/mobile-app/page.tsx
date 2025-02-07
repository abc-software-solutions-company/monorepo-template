import { Metadata } from 'next';

import { PageBaseProps } from '@/interfaces/page.interface';

export default async function PageMobileApp(_pageProps: PageBaseProps) {
  return (
    <div className="grow">
      <div className="container">
        <h1>Mobile App</h1>
      </div>
    </div>
  );
}

export async function generateMetadata({ params: { locale } }: PageBaseProps): Promise<Metadata> {
  return {
    title: 'Mobile App',
    description: 'Mobile App Description',
    alternates: {
      canonical: `/${locale}/mobile-app`,
    },
  };
}
