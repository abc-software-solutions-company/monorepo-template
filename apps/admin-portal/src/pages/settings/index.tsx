import classNames from 'classnames';
import { useTranslations } from 'use-intl';
import { Separator } from '@repo/react-web-ui-shadcn/components/ui/separator';

import PageHeader from '@/components/pages/page-header';
import PageWrapper from '@/components/pages/page-wrapper';

import { SettingNav } from '@/modules/settings/components/setting-nav';
import SettingRoot from '@/modules/settings/components/setting-root';

export default function PageSettings() {
  const t = useTranslations();

  return (
    <PageWrapper>
      <div className={classNames('settings-root flex grow flex-col rounded-lg border bg-card p-4 text-card-foreground shadow-sm')}>
        <PageHeader title={t('page_settings')} description={t('page_settings_description')} />
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-10 lg:space-y-0">
          <aside className="lg:w-1/5">
            <SettingNav />
          </aside>
          <div className="flex-1 lg:max-w-2xl">
            <SettingRoot />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
