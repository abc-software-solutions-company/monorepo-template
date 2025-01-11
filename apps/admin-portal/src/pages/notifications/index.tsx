import classNames from 'classnames';
import { useTranslations } from 'use-intl';
import { Separator } from '@repo/react-web-ui-shadcn/components/ui/separator';

import PageHeader from '@/components/pages/page-header';
import PageWrapper from '@/components/pages/page-wrapper';

import NotificationRoot from '@/modules/notifications/components/notification-root';

export default function PageNotifications() {
  const t = useTranslations();

  return (
    <PageWrapper>
      <div className={classNames('settings-root flex grow flex-col rounded-lg border bg-card p-4 text-card-foreground shadow-sm')}>
        <PageHeader title={t('page_notifications')} description={t('page_notifications_description')} />
        <Separator className="my-6" />
        <NotificationRoot />
      </div>
    </PageWrapper>
  );
}
