import React, { FC, ReactNode } from 'react';
import classNames from 'classnames';
import { Toaster } from '@repo/react-web-ui-shadcn/components/ui/sonner';

import { ComponentBaseProps } from '@/interfaces/component.interface';

import AllTheProviders from '../all-the-providers';

import '@repo/react-web-ui-shadcn/globals.scss';
import '@/globals.scss';
import 'lightgallery.js/dist/css/lightgallery.css';

import 'swiper/scss';
import 'swiper/scss/pagination';

type BodyProps = {
  children: ReactNode;
} & ComponentBaseProps;

const Body: FC<BodyProps> = ({ className, children }) => {
  return (
    <body className={classNames('scrollbar dark flex !h-full flex-col antialiased', className)}>
      <AllTheProviders>
        {children}
        <Toaster />
        <div className="transform-gpu"></div>
      </AllTheProviders>
    </body>
  );
};

export default Body;
