import { Metadata } from 'next';

import { LayoutProps } from '@/interfaces/layout.interface';
import { PageBaseProps } from '@/interfaces/page.interface';

export default async function PageMobileApp(_pageProps: PageBaseProps) {
  return (
    <div className="grow">
      <h1>Mobile App</h1>
    </div>
  );
}

export async function generateMetadata({ params: { locale } }: LayoutProps): Promise<Metadata> {
  return {
    title: 'Mobile App',
    description: 'Mobile App Description',
    alternates: {
      canonical: `/${locale}/mobile-app`,
    },
  };
}
