import { Metadata } from 'next';

import { PageBaseProps } from '@/interfaces/page.interface';

export default async function PageAdminApi(_pageProps: PageBaseProps) {
  return (
    <div className="grow">
      <div className="container">
        <h1>Admin API</h1>
      </div>
    </div>
  );
}

export async function generateMetadata({ params: { locale } }: PageBaseProps): Promise<Metadata> {
  return {
    title: 'Admin API',
    description: 'Admin API Description',
    alternates: {
      canonical: `/${locale}/admin-api`,
    },
  };
}
