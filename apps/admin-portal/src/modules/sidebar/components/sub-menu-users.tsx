import { FC } from 'react';
import classNames from 'classnames';
import { NavLink, useLocation, useSearchParams } from 'react-router-dom';
import { useLocale, useTranslations } from 'use-intl';
import { objectToQueryString } from '@repo/shared-universal/utils/string.util';

type SubMenuUsersProps = {
  type: 'dropdown' | 'list';
  onNavigate?: () => void;
};

const SubMenuUsers: FC<SubMenuUsersProps> = ({ type, onNavigate }) => {
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
          pathname: `/${locale}/users/new`,
          search: `?${objectToQueryString({ sidebar: searchParams.get('sidebar') })}`,
        }}
        className={classNames(
          'flex items-center rounded p-2 transition-colors',
          type === 'dropdown' && 'hover:bg-accent',
          type === 'dropdown' && pathname.includes(`/${locale}/users/new`) && '!bg-primary !text-white',
          type === 'list' && pathname.includes(`/${locale}/users/new`) && '!text-primary'
        )}
        onClick={handleClick}
      >
        <p className={classNames('whitespace-nowrap', className)}>{t('sidebar_menu_users_create_new')}</p>
      </NavLink>
    </div>
  );
};

export default SubMenuUsers;
