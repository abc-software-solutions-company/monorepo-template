'use client';

import React, { FC } from 'react';
import classNames from 'classnames';

import { ComponentBaseProps } from '@/interfaces/component.interface';

import NavigationLink from '../navigation-link';

type MenuProps = ComponentBaseProps;

const Menu: FC<MenuProps> = ({ className, ...rest }) => {
  return (
    <div className={classNames('menu ml-auto', className)} data-testid="main-menu" {...rest}>
      <nav>
        <NavigationLink className="px-4 py-2 font-medium" activeClassName="text-primary font-bold" href={'/'}>
          Home
        </NavigationLink>
        <NavigationLink className="px-4 py-2 font-medium" activeClassName="text-primary font-bold" href={'/admin-portal'}>
          Admin Portal
        </NavigationLink>
        <NavigationLink className="px-4 py-2 font-medium" activeClassName="text-primary font-bold" href={'/mobile-app'}>
          Mobile App
        </NavigationLink>
        <NavigationLink className="px-4 py-2 font-medium" activeClassName="text-primary font-bold" href={'/admin-api'}>
          Admin API
        </NavigationLink>
        <NavigationLink className="px-4 py-2 font-medium" activeClassName="text-primary font-bold" href={'/blog'}>
          Blog
        </NavigationLink>
        <NavigationLink className="px-4 py-2 font-medium" activeClassName="text-primary font-bold" href={'/product'}>
          Product
        </NavigationLink>
      </nav>
    </div>
  );
};

export default Menu;
