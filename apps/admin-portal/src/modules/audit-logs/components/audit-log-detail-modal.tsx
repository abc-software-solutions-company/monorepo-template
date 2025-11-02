import { FC } from 'react';
import { useLocale, useTranslations } from 'use-intl';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@repo/react-web-ui-shadcn/components/ui/dialog';
import { Loading } from '@repo/react-web-ui-shadcn/components/ui/loading';
import { toDateTime } from '@repo/shared-universal/utils/date.util';
import { useQuery } from '@tanstack/react-query';

import { AUDIT_LOG_STATUSES } from '../constants/audit-logs.constant';

import AuditLogActionLabel from './audit-log-action-label';
import AuditLogDiff from './audit-log-diff';

import AuditLogApi from '../api/audit-logs.api';

type AuditLogDetailModalProps = {
  id: string;
  visible: boolean;
  onCancel?: () => void;
};

const AuditLogDetailModal: FC<AuditLogDetailModalProps> = ({ id, visible, onCancel }) => {
  const t = useTranslations();
  const locale = useLocale();
  const {
    data: auditLog,
    isFetching,
    isFetched,
  } = useQuery({
    queryKey: ['get-audit-log', id],
    queryFn: async () => {
      const res = await AuditLogApi.read(id);

      return res.data.data;
    },
    enabled: visible && !!id,
    gcTime: 0,
  });

  return (
    <Dialog open={visible} onOpenChange={onCancel}>
      <DialogContent className="top-0 max-w-7xl translate-y-0">
        {isFetching && (
          <>
            <VisuallyHidden>
              <DialogHeader>
                <DialogTitle></DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>
            </VisuallyHidden>
            <div className="flex items-center justify-center py-10">
              <Loading />
            </div>
          </>
        )}
        {isFetched && auditLog && (
          <>
            <DialogHeader>
              <DialogTitle>{auditLog.title}</DialogTitle>
              <VisuallyHidden>
                <DialogDescription></DialogDescription>
              </VisuallyHidden>
            </DialogHeader>
            <div className="px-4">
              <div className="grid gap-1 md:flex">
                <div className="grid w-full gap-1">
                  <div className="flex items-center gap-1">
                    <strong>{t('audit_log_user')}:</strong>
                    <span>{auditLog.user.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <strong>{t('audit_log_user_email')}:</strong>
                    <span>{auditLog.user.email}</span>
                  </div>
                </div>
                <div className="grid w-full gap-1">
                  <div className="flex items-center gap-1">
                    <strong>{t('audit_log_created_at')}:</strong>
                    <span>{toDateTime(new Date(auditLog.createdAt), locale)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <strong>{t('audit_log_action')}:</strong>
                    <AuditLogActionLabel items={AUDIT_LOG_STATUSES} value={auditLog.action} />
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4">
              <AuditLogDiff oldData={auditLog.oldValue} newData={auditLog.newValue} />
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuditLogDetailModal;
