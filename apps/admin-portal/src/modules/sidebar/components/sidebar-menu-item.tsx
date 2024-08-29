import { ReactNode } from 'react';
import classNames from 'classnames';
import { LucideIcon } from 'lucide-react';
import { NavLink, useLocation, useSearchParams } from 'react-router-dom';
import { useLocale } from 'use-intl';
import { objectToQueryString } from '~shared-universal/utils/string.util';

import { ComponentBaseProps } from '@/interfaces/component.interface';

type SidebarMenuItemProps = {
  url: string;
  isExpand: boolean;
  options: {
    icon: LucideIcon;
  };
  children?: ReactNode;
} & ComponentBaseProps;

function getNodePath(url: string, locale: string): string {
  const paths = [`/${locale}/documentation`, `/${locale}/settings`, `/${locale}/notifications`, `/${locale}/profile`];

  return paths.find(path => url.includes(path)) || url;
}

export function SidebarMenuItem({ className, isExpand, children, url, options }: SidebarMenuItemProps) {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const locale = useLocale();

  const nodePath = getNodePath(url, locale);

  const linkClasses = classNames(
    'flex w-full cursor-pointer items-center gap-x-2 rounded-md px-3.5 py-2 transition-background hover:bg-accent',
    pathname.includes(nodePath) && '!bg-primary text-primary-foreground',
    className
  );
  const iconClasses = 'ml-[2px] h-6 w-6';
  const textClasses = classNames('whitespace-nowrap transition-opacity duration-500', isExpand ? 'opacity-1' : 'opacity-0');

  return (
    <NavLink
      className={linkClasses}
      to={{
        pathname: url,
        search: `?${objectToQueryString({ sidebar: searchParams.get('sidebar') })}`,
      }}
    >
      <div className={iconClasses}>{options.icon && <options.icon size={22} strokeWidth={1.5} />}</div>
      <p className={textClasses}>{children}</p>
    </NavLink>
  );
}

export default SidebarMenuItem;
