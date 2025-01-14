import { FC } from 'react';
import classNames from 'classnames';
import { NavLink, useLocation, useSearchParams } from 'react-router-dom';
import { useLocale } from 'use-intl';
import { objectToQueryString } from '@repo/shared-universal/utils/string.util';

type SubMenuDocumentationProps = {
  type: 'dropdown' | 'list';
  onNavigate?: () => void;
};

const SubMenuDocumentation: FC<SubMenuDocumentationProps> = ({ type, onNavigate }) => {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const locale = useLocale();

  const handleClick = () => {
    onNavigate?.();
  };

  const className = type === 'list' ? 'px-10' : '';

  return (
    <div>
      <NavLink
        to={{
          pathname: `/${locale}/documentation/getting-started`,
          search: `?${objectToQueryString({ sidebar: searchParams.get('sidebar') })}`,
        }}
        className={classNames(
          'flex items-center rounded p-2 transition-colors',
          type === 'dropdown' && 'hover:bg-accent',
          type === 'dropdown' && pathname.includes(`/${locale}/documentation/getting-started`) && '!bg-primary !text-white',
          type === 'list' && pathname.includes(`/${locale}/documentation/getting-started`) && '!text-primary'
        )}
        onClick={handleClick}
      >
        <p className={classNames('whitespace-nowrap', className)}>Getting Started</p>
      </NavLink>
      <NavLink
        to={`/${locale}/documentation/components`}
        className={classNames(
          'flex items-center rounded p-2 transition-colors',
          type === 'dropdown' && 'hover:bg-accent',
          type === 'dropdown' && pathname.includes(`/${locale}/documentation/components`) && '!bg-primary !text-white',
          type === 'list' && pathname.includes(`/${locale}/documentation/components`) && '!text-primary'
        )}
        onClick={handleClick}
      >
        <p className={classNames('whitespace-nowrap', className)}>Components</p>
      </NavLink>
      <NavLink
        to={`/${locale}/documentation/changelogs`}
        className={classNames(
          'flex items-center rounded p-2 transition-colors',
          type === 'dropdown' && 'hover:bg-accent',
          type === 'dropdown' && pathname.includes(`/${locale}/documentation/changelogs`) && '!bg-primary !text-white',
          type === 'list' && pathname.includes(`/${locale}/documentation/changelogs`) && '!text-primary'
        )}
        onClick={handleClick}
      >
        <p className={classNames('whitespace-nowrap', className)}>Changelog</p>
      </NavLink>
    </div>
  );
};

export default SubMenuDocumentation;
