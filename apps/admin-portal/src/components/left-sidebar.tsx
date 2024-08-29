import { FC, ReactNode, useState } from 'react';
import classNames from 'classnames';
import { useSearchParams } from 'react-router-dom';

import { ComponentBaseProps } from '@/interfaces/component.interface';

import Header from '@/components/headers/header';

import Sidebar from '@/modules/sidebar/components/sidebar';

type LeftSidebarProps = {
  children?: ReactNode;
} & ComponentBaseProps;

const LeftSidebar: FC<LeftSidebarProps> = ({ children }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSidebarExpand, setIsSidebarExpand] = useState(!searchParams.has('sidebar'));

  const toggle = () => {
    if (isSidebarExpand) {
      setIsSidebarExpand(false);
      setSearchParams({ sidebar: 'closed' });
    } else {
      setIsSidebarExpand(true);
      setSearchParams();
    }
  };

  return (
    <div className="layout-with-left-sidebar flex grow flex-col">
      <Sidebar isExpand={isSidebarExpand} />
      <div className={classNames('nap-content flex grow flex-col transition-spacing duration-500', isSidebarExpand ? 'pl-64' : 'pl-20')}>
        <Header onSidebarCollapseClick={toggle} />
        {children}
      </div>
    </div>
  );
};

export default LeftSidebar;
