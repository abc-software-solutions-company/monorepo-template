import { FC } from 'react';
import classNames from 'classnames';
import { NavLink, useLocation, useSearchParams } from 'react-router-dom';
import { useLocale, useTranslations } from 'use-intl';
import { objectToQueryString } from '@repo/shared-universal/utils/string.util';

import { ComponentBaseProps } from '@/interfaces/component.interface';

const ProfileNavigation: FC<ComponentBaseProps> = ({ className }) => {
  const t = useTranslations();
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();
  const locale = useLocale();

  return (
    <div className={classNames('flex gap-x-6 px-4', className)}>
      <NavLink
        to={{
          pathname: `/${locale}/profile/overview`,
          search: `?${objectToQueryString({ sidebar: searchParams.get('sidebar') })}`,
        }}
        className={classNames(
          'relative inline-flex py-3.5',
          pathname.includes(`/${locale}/profile/overview`) &&
            'after:absolute after:bottom-0 after:left-0 after:block after:h-0.5 after:w-full after:bg-primary after:content-[""]'
        )}
      >
        {t('profile_overview')}
      </NavLink>
      <NavLink
        to={{
          pathname: `/${locale}/profile/posts`,
          search: `?${objectToQueryString({ sidebar: searchParams.get('sidebar') })}`,
        }}
        className={classNames(
          'relative inline-flex py-3.5',
          pathname.includes(`/${locale}/profile/posts`) &&
            'after:absolute after:bottom-0 after:left-0 after:block after:h-0.5 after:w-full after:bg-primary after:content-[""]'
        )}
      >
        {t('profile_posts')}
      </NavLink>
      <NavLink
        to={{
          pathname: `/${locale}/profile/activities`,
          search: `?${objectToQueryString({ sidebar: searchParams.get('sidebar') })}`,
        }}
        className={classNames(
          'relative inline-flex py-3.5',
          pathname.includes(`/${locale}/profile/activities`) &&
            'after:absolute after:bottom-0 after:left-0 after:block after:h-0.5 after:w-full after:bg-primary after:content-[""]'
        )}
      >
        {t('profile_activities')}
      </NavLink>
    </div>
  );
};

export default ProfileNavigation;
