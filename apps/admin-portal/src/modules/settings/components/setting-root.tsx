import { useLocation } from 'react-router-dom';
import { useLocale, useTranslations } from 'use-intl';

import { SettingFormAccount } from './setting-form-account';
import { SettingFormAppearance } from './setting-form-appearance';
import { SettingFormNotifications } from './setting-form-notifications';
import SettingHeading from './setting-heading';

const SettingRoot = () => {
  const t = useTranslations();
  const { pathname } = useLocation();
  const locale = useLocale();

  const routes = {
    [`/${locale}/settings/account`]: (
      <>
        <SettingHeading title={t('sidebar_menu_settings_account')} description={t('sidebar_menu_settings_account_desc')} />
        <SettingFormAccount />
      </>
    ),
    [`/${locale}/settings/appearance`]: (
      <>
        <SettingHeading title={t('sidebar_menu_settings_appearance')} description={t('sidebar_menu_settings_appearance_desc')} />
        <SettingFormAppearance />
      </>
    ),
    [`/${locale}/settings/notifications`]: (
      <>
        <SettingHeading title={t('sidebar_menu_settings_notifications')} description={t('sidebar_menu_settings_notifications_desc')} />
        <SettingFormNotifications />
      </>
    ),
  };

  return routes[pathname] || null;
};

export default SettingRoot;
