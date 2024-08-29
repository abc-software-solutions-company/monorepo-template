import PageWrapper from '@/components/pages/page-wrapper';

import { AuditLogList } from '@/modules/audit-logs/components/audit-log-list';

export default function PageAuditLogs() {
  return (
    <PageWrapper>
      <AuditLogList />
    </PageWrapper>
  );
}
