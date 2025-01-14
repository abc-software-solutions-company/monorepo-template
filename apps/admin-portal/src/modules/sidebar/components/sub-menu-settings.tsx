import { FC } from 'react';
import classNames from 'classnames';
import { NavLink, useLocation, useSearchParams } from 'react-router-dom';
import { useLocale, useTranslations } from 'use-intl';
import { objectToQueryString } from '@repo/shared-universal/utils/string.util';

type SubMenuSettingsProps = {
  type: 'dropdown' | 'list';
  onNavigate?: () => void;
};

const SubMenuSettings: FC<SubMenuSettingsProps> = ({ type, onNavigate }) => {
  const t = useTranslations();
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();
  const locale = useLocale();

  const handleClick = () => {
    onNavigate?.();
  };

  const className = type === 'list' ? 'px-10' : '';

  return (
    <div>
      <NavLink
        to={{
          pathname: `/${locale}/settings/account`,
          search: `?${objectToQueryString({ sidebar: searchParams.get('sidebar') })}`,
        }}
        className={classNames(
          'flex items-center rounded p-2 transition-colors',
          type === 'dropdown' && 'hover:bg-accent',
          type === 'dropdown' && pathname.includes(`/${locale}/settings/account`) && '!bg-primary !text-white',
          type === 'list' && pathname.includes(`/${locale}/settings/account`) && '!text-primary'
        )}
        onClick={handleClick}
      >
        <p className={classNames('whitespace-nowrap', className)}>{t('sidebar_menu_settings_account')}</p>
      </NavLink>
      <NavLink
        to={{
          pathname: `/${locale}/settings/appearance`,
          search: `?${objectToQueryString({ sidebar: searchParams.get('sidebar') })}`,
        }}
        className={classNames(
          'flex items-center rounded p-2 transition-colors',
          type === 'dropdown' && 'hover:bg-accent',
          type === 'dropdown' && pathname.includes(`/${locale}/settings/appearance`) && '!bg-primary !text-white',
          type === 'list' && pathname.includes(`/${locale}/settings/appearance`) && '!text-primary'
        )}
        onClick={handleClick}
      >
        <p className={classNames('whitespace-nowrap', className)}>{t('sidebar_menu_settings_appearance')}</p>
      </NavLink>
      <NavLink
        to={{
          pathname: `/${locale}/settings/notifications`,
          search: `?${objectToQueryString({ sidebar: searchParams.get('sidebar') })}`,
        }}
        className={classNames(
          'flex items-center rounded p-2 transition-colors',
          type === 'dropdown' && 'hover:bg-accent',
          type === 'dropdown' && pathname.includes(`/${locale}/settings/notifications`) && '!bg-primary !text-white',
          type === 'list' && pathname.includes(`/${locale}/settings/notifications`) && '!text-primary'
        )}
        onClick={handleClick}
      >
        <p className={classNames('whitespace-nowrap', className)}>{t('sidebar_menu_settings_notifications')}</p>
      </NavLink>
    </div>
  );
};

export default SubMenuSettings;
