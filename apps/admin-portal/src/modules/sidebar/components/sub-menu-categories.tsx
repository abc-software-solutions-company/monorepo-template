import { FC } from 'react';
import classNames from 'classnames';
import { NavLink, useLocation, useSearchParams } from 'react-router-dom';
import { useLocale, useTranslations } from 'use-intl';
import { objectToQueryString } from '@repo/shared-universal/utils/string.util';

type SubMenuCategoriesProps = {
  type: 'dropdown' | 'list';
};

const SubMenuCategories: FC<SubMenuCategoriesProps> = ({ type }) => {
  const t = useTranslations();
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();
  const locale = useLocale();

  const className = type === 'list' ? 'px-10' : '';

  return (
    <div>
      <NavLink
        to={{
          pathname: `/${locale}/categories/new`,
          search: `?${objectToQueryString({ sidebar: searchParams.get('sidebar') })}`,
        }}
        className={classNames(
          'flex items-center rounded p-2 transition-colors',
          type === 'dropdown' && 'hover:bg-accent',
          type === 'dropdown' && pathname.includes(`/${locale}/categories/new`) && '!bg-primary !text-white',
          type === 'list' && pathname.includes(`/${locale}/categories/new`) && '!text-primary'
        )}
      >
        <p className={classNames('whitespace-nowrap', className)}>{t('sidebar_menu_categories_create_new')}</p>
      </NavLink>
    </div>
  );
};

export default SubMenuCategories;
