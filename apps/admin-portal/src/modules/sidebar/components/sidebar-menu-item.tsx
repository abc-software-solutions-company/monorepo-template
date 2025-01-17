import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { NavLink, useLocation, useSearchParams } from 'react-router-dom';
import { useLocale } from 'use-intl';
import { cn } from '@repo/react-web-ui-shadcn/lib/utils';
import { objectToQueryString } from '@repo/shared-universal/utils/string.util';

import { ComponentBaseProps } from '@/interfaces/component.interface';

type SidebarMenuItemProps = {
  url: string;
  queryParams?: Record<string, unknown>;
  isExpand: boolean;
  options: {
    icon: LucideIcon;
    onClick?: () => void;
  };
  children?: ReactNode;
} & ComponentBaseProps;

function getNodePath(url: string, locale: string): string {
  const paths = [`/${locale}/documentation`, `/${locale}/settings`, `/${locale}/notifications`, `/${locale}/profile`];

  return paths.find(path => url.includes(path)) || url;
}

export function SidebarMenuItem({ className, isExpand, children, url, queryParams, options }: SidebarMenuItemProps) {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const locale = useLocale();

  const nodePath = getNodePath(url, locale);
  const isQueryParamsActive = queryParams ? Object.entries(queryParams).every(([key, value]) => searchParams.get(key) === String(value)) : true;
  const linkClasses = cn(
    'flex w-full cursor-pointer items-center gap-x-2 rounded-md px-3.5 py-2 transition-background hover:bg-accent',
    pathname.includes(nodePath) && isQueryParamsActive && '!bg-primary text-primary-foreground',
    className
  );
  const iconClasses = 'ml-[2px] h-6 w-6';
  const textClasses = cn('whitespace-nowrap transition-opacity duration-500', isExpand ? 'opacity-1' : 'opacity-0');

  const handleClick = () => {
    options?.onClick?.();
  };

  return (
    <NavLink
      className={linkClasses}
      to={{
        pathname: url,
        search: `?${objectToQueryString({ ...queryParams, sidebar: searchParams.get('sidebar') })}`,
      }}
      onClick={handleClick}
    >
      <div className={iconClasses}>{options.icon && <options.icon size={22} strokeWidth={1.5} />}</div>
      <p className={textClasses}>{children}</p>
    </NavLink>
  );
}

export default SidebarMenuItem;
