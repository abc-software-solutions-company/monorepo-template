import { Metadata } from 'next/types';

import { LayoutProps } from '@/interfaces/layout.interface';
import { PageBaseProps } from '@/interfaces/page.interface';

export default async function PageAdminApi(_pageProps: PageBaseProps) {
  return (
    <div className="grow">
      <h1>Admin API</h1>
    </div>
  );
}

export async function generateMetadata({ params: { locale } }: LayoutProps): Promise<Metadata> {
  return {
    title: 'Admin API',
    description: 'Admin API Description',
    alternates: {
      canonical: `/${locale}/admin-api`,
    },
  };
}
