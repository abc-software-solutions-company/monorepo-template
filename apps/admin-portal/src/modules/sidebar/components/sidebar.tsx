import { FC, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import { ComponentBaseProps } from '@/interfaces/component.interface';

import SidebarHeader from './sidebar-header';
import SidebarNavigation from './sidebar-navigation';

type SidebarProps = {
  isExpand: boolean;
} & ComponentBaseProps;

const Sidebar: FC<SidebarProps> = ({ className, isExpand = true, ...rest }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  useEffect(() => {
    setIsSidebarExpanded(isExpand);
  }, [isExpand]);

  return (
    <div
      ref={ref}
      className={classNames(
        'nap-sidebar fixed z-20 flex h-full flex-col border-r bg-card transition-width duration-500',
        className,
        isExpand ? 'w-64' : 'w-20'
      )}
      data-testid="sidebar"
      {...rest}
    >
      <SidebarHeader isExpand={isSidebarExpanded} />
      <SidebarNavigation isExpand={isSidebarExpanded} />
    </div>
  );
};

export default Sidebar;
