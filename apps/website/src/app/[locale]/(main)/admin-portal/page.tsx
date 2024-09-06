import { PageBaseProps } from '@/interfaces/page.interface';

import AdminPortalRoot from '@/modules/admin-portal/components/admin-portal-root';

export default async function PageAdminPortal(_pageProps: PageBaseProps) {
  return (
    <div className="grow">
      <AdminPortalRoot />
    </div>
  );
}
