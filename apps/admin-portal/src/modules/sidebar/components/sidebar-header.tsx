import { FC } from 'react';
import classNames from 'classnames';

import { ComponentBaseProps } from '@/interfaces/component.interface';

import Logo from '@/components/icons/logo';

type SidebarHeaderProps = ComponentBaseProps & {
  isExpand: boolean;
};

const SidebarHeader: FC<SidebarHeaderProps> = ({ className, isExpand }) => {
  return (
    <div className={classNames('nap-sidebar-icon flex items-center px-3', className)}>
      <div className="flex h-16 items-center gap-x-3">
        <Logo className={`cursor-pointer transition-transform duration-500 ${isExpand && 'rotate-[360deg]'}`} />
        <h1 className={`origin-left text-2xl font-semibold transition-transform duration-500 ${!isExpand && 'scale-0'}`}>
          <span className="bg-gradient-to-r from-white from-10% via-white via-30% to-primary to-90% bg-clip-text uppercase text-transparent">
            Admin
          </span>
        </h1>
      </div>
    </div>
  );
};

export default SidebarHeader;
