'use client';

import { FC, useEffect, useState } from 'react';
import { Session } from 'next-auth';
import classNames from 'classnames';
import { throttle } from 'lodash-es';

import Authenticated from '@/modules/auth/components/authenticated';
import Unauthenticated from '@/modules/auth/components/unauthenticated';

import Logo from '../icons/logo';
import Languages from '../languages/languages';
import Menu from '../menus/menu';
import MenuMobile from '../menus/menu-mobile';

interface ITopBarProps {
  userSession: Session | null;
}

const TopBar: FC<ITopBarProps> = ({ userSession }) => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = throttle(() => {
      if (window.scrollY > 0) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    }, 100);

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      className={classNames('sticky top-0 z-30 py-1.5 transition-all duration-300 lg:py-3', isSticky && 'bg-background shadow-md')}
      data-testid="topbar"
    >
      <div className="container">
        <div className="flex flex-wrap items-center justify-between">
          <Logo />
          <Menu className="hidden md:inline-flex" />
          <Languages className="hidden lg:flex" />
          <div className="authentication ml-6 hidden items-center md:inline-flex">
            <Authenticated userSession={userSession} />
            <Unauthenticated visible={!userSession} />
          </div>
          <MenuMobile className="inline-flex md:hidden" />
        </div>
      </div>
    </div>
  );
};

export default TopBar;
