import { Metadata } from 'next';

import { PageBaseProps } from '@/interfaces/page.interface';

import AdminPortalRoot from '@/modules/admin-portal/components/admin-portal-root';

export default async function PageAdminPortal(_pageProps: PageBaseProps) {
  return (
    <div className="grow">
      <AdminPortalRoot />
    </div>
  );
}

export async function generateMetadata({ params: { locale } }: PageBaseProps): Promise<Metadata> {
  return {
    title: 'Admin Portal',
    description: 'Admin Portal Description',
    alternates: {
      canonical: `/${locale}/admin-portal`,
    },
  };
}
