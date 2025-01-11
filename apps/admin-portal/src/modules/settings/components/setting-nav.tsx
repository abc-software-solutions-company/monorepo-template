import classNames from 'classnames';
import { NavLink, useLocation, useSearchParams } from 'react-router-dom';
import { useLocale, useTranslations } from 'use-intl';
import { objectToQueryString } from '@repo/shared-universal/utils/string.util';

interface ISettingNavProps extends React.HTMLAttributes<HTMLElement> {}

export function SettingNav({ className, ...props }: ISettingNavProps) {
  const t = useTranslations();
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();
  const locale = useLocale();

  const settingsNavItems = [
    { title: t('sidebar_menu_settings_account'), href: 'account' },
    { title: t('sidebar_menu_settings_appearance'), href: 'appearance' },
    { title: t('sidebar_menu_settings_notifications'), href: 'notifications' },
  ];

  return (
    <nav className={classNames('flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1', className)} {...props}>
      {settingsNavItems.map(item => (
        <NavLink
          key={item.href}
          to={{
            pathname: `/${locale}/settings/${item.href}`,
            search: `?${objectToQueryString({ sidebar: searchParams.get('sidebar') })}`,
          }}
          className={classNames(
            'rounded-md px-3 py-2 font-medium !no-underline',
            pathname === `/${locale}/settings/${item.href}` ? 'bg-muted hover:bg-muted' : 'hover:bg-transparent hover:underline'
          )}
        >
          {item.title}
        </NavLink>
      ))}
    </nav>
  );
}
