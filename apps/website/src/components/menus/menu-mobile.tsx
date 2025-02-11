import React, { FC, useEffect, useState } from 'react';
import { MenuIcon, X } from 'lucide-react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@repo/react-web-ui-shadcn/components/ui/drawer';
import { cn } from '@repo/react-web-ui-shadcn/lib/utils';
import { useMediaQuery } from '@repo/shared-web/hooks/use-media-query';

import Logo from '../icons/logo';
import NavigationLink from '../navigation-link';

const CURRENT_YEAR = new Date().getFullYear();

type MenuMobileProps = {
  className?: string;
};

const MenuMobile: FC<MenuMobileProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 1024px)');

  const handleNavigate = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [isMobile]);

  return (
    <Drawer direction="top" open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild className={cn(className)} onClick={() => setIsOpen(true)}>
        <button type="button" className="p-2 pr-0" aria-label="menu-mobile">
          <MenuIcon />
        </button>
      </DrawerTrigger>
      <DrawerContent className="left-auto right-0 top-0 mt-0 h-screen w-full rounded-none lg:hidden">
        <VisuallyHidden>
          <DrawerHeader>
            <DrawerTitle>Menu</DrawerTitle>
            <DrawerDescription>Mobile menu</DrawerDescription>
          </DrawerHeader>
        </VisuallyHidden>
        <div className="flex items-center justify-between px-3 py-1.5">
          <Logo />
          <button type="button" aria-label="close-menu-mobile" className="p-2 pr-0" onClick={() => setIsOpen(false)}>
            <X />
          </button>
        </div>
        <div className="scrollbar flex h-screen flex-col justify-between p-3 text-xl">
          <div className="mt-6 grid gap-4">
            <NavigationLink href="/" onClick={handleNavigate}>
              HOME
            </NavigationLink>
            <NavigationLink href="/blog" onClick={handleNavigate}>
              BLOG
            </NavigationLink>
            <NavigationLink href="/product" onClick={handleNavigate}>
              PRODUCT
            </NavigationLink>
            <NavigationLink href="/terms-and-conditions" onClick={handleNavigate}>
              TERMS AND CONDITIONS
            </NavigationLink>
            <NavigationLink href="/privacy-policy" onClick={handleNavigate}>
              PRIVACY POLICY
            </NavigationLink>
          </div>
        </div>
        <div className="px-3 py-1.5 text-xs uppercase text-muted-foreground">
          <p>Copyright {CURRENT_YEAR}.</p>
          <p>ABC Digital</p>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MenuMobile;
