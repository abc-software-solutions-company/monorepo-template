import { FC, ReactNode, useEffect, useState } from 'react';
import classNames from 'classnames';
import { useSearchParams } from 'react-router-dom';
import { useMediaQuery } from '@repo/shared-web/hooks/use-media-query';

import { ComponentBaseProps } from '@/interfaces/component.interface';

import Header from '@/components/headers/header';

import Sidebar from '@/modules/sidebar/components/sidebar';
import SidebarDrawer from '@/modules/sidebar/components/sidebar-drawer';

type LeftSidebarProps = {
  children?: ReactNode;
} & ComponentBaseProps;

const LeftSidebar: FC<LeftSidebarProps> = ({ children }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSidebarExpand, setIsSidebarExpand] = useState(!searchParams.has('sidebar'));
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 1024px)');
  const [isInMobileView, setIsInMobileView] = useState(isMobile);

  const toggleSidebar = () => {
    if (isSidebarExpand) {
      setIsSidebarExpand(false);
      setSearchParams({ sidebar: 'closed' });
    } else {
      setIsSidebarExpand(true);
      setSearchParams();
    }
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  useEffect(() => {
    if (!isMobile) {
      setIsDrawerOpen(false);
    }
  }, [isMobile]);

  useEffect(() => {
    if (isMobile !== isInMobileView) {
      setIsInMobileView(isMobile);
    }
  }, [isMobile, isInMobileView]);

  return (
    <div className="layout-with-left-sidebar flex grow flex-col">
      {isMobile && <SidebarDrawer isOpen={isDrawerOpen} onOpenChange={setIsDrawerOpen} />}
      {!isMobile && <Sidebar isExpand={isSidebarExpand} isMobile={isMobile} />}
      <div
        className={classNames('nap-content flex grow flex-col', {
          'pl-64': isSidebarExpand && !isMobile,
          'pl-20': !isSidebarExpand && !isMobile,
          'pl-0': isMobile,
          'transition-spacing duration-500': !isMobile && !isInMobileView,
        })}
      >
        <Header onSidebarCollapseClick={isMobile ? toggleDrawer : toggleSidebar} />
        {children}
      </div>
    </div>
  );
};

export default LeftSidebar;
