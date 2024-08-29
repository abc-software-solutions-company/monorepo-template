import { FC } from 'react';
import classNames from 'classnames';
import { ChevronUpIcon } from 'lucide-react';

import { ComponentBaseProps } from '@/interfaces/component.interface';

type SidebarMenuIndicatorProps = {
  isOpen: boolean;
  isActive: boolean;
  isExpand: boolean;
} & ComponentBaseProps;

const SidebarMenuIndicator: FC<SidebarMenuIndicatorProps> = ({ className, isOpen, isActive, isExpand }) => {
  return (
    <button className={classNames('absolute right-5 top-2 h-6 w-6', className)}>
      <ChevronUpIcon
        className={classNames(
          'mx-auto h-4 w-4 origin-center transition-all duration-200',
          isActive && 'text-primary-foreground',
          isOpen ? 'rotate-0' : 'rotate-180',
          isExpand ? 'opacity-100 delay-100' : 'opacity-0'
        )}
        size={16}
      />
    </button>
  );
};

export default SidebarMenuIndicator;
