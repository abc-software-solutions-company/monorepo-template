import { FC } from 'react';
import { X } from 'lucide-react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '@repo/react-web-ui-shadcn/components/ui/drawer';
import { cn } from '@repo/react-web-ui-shadcn/lib/utils';

import SidebarHeader from '@/modules/sidebar/components/sidebar-header';

import SidebarNavigation from './sidebar-navigation';

type SidebarDrawerProps = {
  className?: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

const SidebarDrawer: FC<SidebarDrawerProps> = ({ isOpen, onOpenChange, className }) => {
  return (
    <Drawer direction="left" open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className={cn('left-0 right-auto top-0 mt-0 h-screen w-64 rounded-none lg:hidden', className)}>
        <VisuallyHidden>
          <DrawerHeader>
            <DrawerTitle>Menu</DrawerTitle>
            <DrawerDescription>Mobile menu</DrawerDescription>
          </DrawerHeader>
        </VisuallyHidden>
        <div className="flex items-center justify-between px-3 py-1.5">
          <SidebarHeader isExpand={true} />
          <button type="button" className="p-2 pr-0" onClick={() => onOpenChange(false)}>
            <X />
          </button>
        </div>
        <div className="scrollbar flex h-screen flex-col">
          <SidebarNavigation isExpand={true} onNavigate={() => onOpenChange(false)} />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default SidebarDrawer;
