import { FC } from 'react';
import classNames from 'classnames';
import { NavLink, useLocation, useSearchParams } from 'react-router-dom';
import { useLocale, useTranslations } from 'use-intl';
import { objectToQueryString } from '~shared-universal/utils/string.util';

type SubMenuProfileProps = {
  type: 'dropdown' | 'list';
};

const SubMenuProfile: FC<SubMenuProfileProps> = ({ type }) => {
  const t = useTranslations();
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();
  const locale = useLocale();

  const className = type === 'list' ? 'px-10' : '';

  return (
    <div>
      <NavLink
        to={{
          pathname: `/${locale}/profile/overview`,
          search: `?${objectToQueryString({ sidebar: searchParams.get('sidebar') })}`,
        }}
        className={classNames(
          'flex items-center rounded p-2 transition-colors',
          type === 'dropdown' && 'hover:bg-accent',
          type === 'dropdown' && pathname.includes(`/${locale}/profile/overview`) && '!bg-primary !text-white',
          type === 'list' && pathname.includes(`/${locale}/profile/overview`) && '!text-primary'
        )}
      >
        <p className={classNames('whitespace-nowrap', className)}>{t('sidebar_menu_profile_overview')}</p>
      </NavLink>
      <NavLink
        to={{
          pathname: `/${locale}/profile/posts`,
          search: `?${objectToQueryString({ sidebar: searchParams.get('sidebar') })}`,
        }}
        className={classNames(
          'flex items-center rounded p-2 transition-colors',
          type === 'dropdown' && 'hover:bg-accent',
          type === 'dropdown' && pathname.includes(`/${locale}/profile/posts`) && '!bg-primary !text-white',
          type === 'list' && pathname.includes(`/${locale}/profile/posts`) && '!text-primary'
        )}
      >
        <p className={classNames('whitespace-nowrap', className)}>{t('sidebar_menu_profile_posts')}</p>
      </NavLink>
      <NavLink
        to={{
          pathname: `/${locale}/profile/activities`,
          search: `?${objectToQueryString({ sidebar: searchParams.get('sidebar') })}`,
        }}
        className={classNames(
          'flex items-center rounded p-2 transition-colors',
          type === 'dropdown' && 'hover:bg-accent',
          type === 'dropdown' && pathname.includes(`/${locale}/profile/activities`) && '!bg-primary !text-white',
          type === 'list' && pathname.includes(`/${locale}/profile/activities`) && '!text-primary'
        )}
      >
        <p className={classNames('whitespace-nowrap', className)}>{t('sidebar_menu_profile_activities')}</p>
      </NavLink>
    </div>
  );
};

export default SubMenuProfile;
