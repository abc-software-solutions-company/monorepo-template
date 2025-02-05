'use client';

import React, { FC } from 'react';
import Image from 'next/image';
import classNames from 'classnames';
import { Button } from '@repo/react-web-ui-shadcn/components/ui/button';

import { ComponentBaseProps } from '@/interfaces/component.interface';

import fileManImg from '@/assets/images/home-file-man.png';

const Hero: FC<ComponentBaseProps> = ({ className }) => {
  return (
    <div id="hero" className={classNames('relative overflow-hidden py-14 md:py-32', className)}>
      {/* <div className="glow-effect top-40 z-0 h-80 w-60"></div> */}
      <section className="container grid place-items-center gap-10 lg:grid-cols-2">
        <div className="text-center lg:text-start">
          <strong className="rounded-md bg-primary/20 px-2 py-0.5 text-xs text-primary">Over 200 highly customizable components</strong>
          <main className="mt-2 text-5xl font-bold md:text-6xl">
            <h1 className="leading-tight">
              <span className="bg-gradient-to-r from-[#F596D3] to-[#D247BF] bg-clip-text text-transparent">Ready</span> to use for{' '}
              <span className="bg-gradient-to-r from-[#61DAFB] via-[#1fc0f1] to-[#03a3d7] bg-clip-text text-transparent">Javascript</span> developers
            </h1>
          </main>
          <p className="mx-auto mt-6 text-xl text-muted-foreground md:w-10/12 lg:mx-0">
            Build your next application faster with a high-quality collection of elements and components.
          </p>
          <div className="mt-6 space-y-4 md:space-x-4 md:space-y-0">
            <Button className="w-full max-w-48 rounded-full py-7 text-base font-bold">Live Demo</Button>
          </div>
        </div>
        <div className="relative w-full">
          <Image priority loading="eager" src={fileManImg} alt="hero image" className="rounded-xl" width={1000} height={915} />
        </div>
      </section>
    </div>
  );
};

export default Hero;
