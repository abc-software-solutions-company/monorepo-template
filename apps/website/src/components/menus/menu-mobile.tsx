import React, { FC } from 'react';
import { MenuIcon } from 'lucide-react';
import { Drawer, DrawerContent, DrawerTrigger } from '~react-web-ui-shadcn/components/ui/drawer';
import { ScrollArea } from '~react-web-ui-shadcn/components/ui/scroll-area';

import { ComponentBaseProps } from '@/interfaces/component.interface';

type MenuMobileProps = {
  data?: unknown;
} & ComponentBaseProps;

const MenuMobile: FC<MenuMobileProps> = ({ className }) => {
  return (
    <Drawer direction="right">
      <DrawerTrigger className={className}>
        <MenuIcon />
      </DrawerTrigger>
      <DrawerContent className="left-auto right-0 top-0 mt-0 h-screen w-96 rounded-none">
        <ScrollArea className="h-screen p-3">
          <h3>Menu</h3>
          <h3>Menu</h3>
          <h3>Menu</h3>
          <h3>Menu</h3>
          <h3>Menu</h3>
          <h3>Menu</h3>
          <h3>Menu</h3>
          <h3>Menu</h3>
          <h3>Menu</h3>
          <h3>Menu</h3>
          <h3>Menu</h3>
          <h3>Menu</h3>
          <h3>Menu</h3>
          <h3>Menu</h3>
          <h3>Menu</h3>
          <h3>Menu</h3>
          <h3>Menu</h3>
          <h3>Menu</h3>
          <h3>Menu</h3>
          <h3>Menu</h3>
          <h3>Menu</h3>
          <h3>Menu</h3>
          <h3>Menu</h3>
          <h3>Menu</h3>
          <h3>Menu</h3>
          <h3>Menu</h3>
          <h3>Menu</h3>
          <h3>Menu</h3>
          <h3>Menu</h3>
          <h3>Menu</h3>
          <h3>Menu</h3>
          <h3>Menu</h3>
          <h3>Menu</h3>
          <h3>Menu</h3>
          <h3>Menu</h3>
          <h3>Menu</h3>
          <h3>Menu</h3>
          <h3>Menu</h3>
          <h3>Menu</h3>
          <h3>Menu</h3>
          <h3>Menu</h3>
          <h3>Menu</h3>
          <h3>Menu</h3>
          <h3>Menu</h3>
          <h3>Menu</h3>
          <h3>Menu</h3>
          <h3>Menu</h3>
          <h3>Menu</h3>
          <h3>Menu</h3>
          <h3>Menu</h3>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};

export default MenuMobile;
