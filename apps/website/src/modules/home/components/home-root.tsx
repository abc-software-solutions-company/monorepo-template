'use client';

import React, { FC } from 'react';

import { ComponentBaseProps } from '@/interfaces/component.interface';

import ContactRoot from '@/modules/contacts/components/contact-root';

import { FrequentlyAskedQuestions } from './frequently-asked-questions';
import Hero from './hero';
import HowItWorks from './how-it-works';
import Projects from './projects';

const HomeRoot: FC<ComponentBaseProps> = () => {
  return (
    <div className="relative">
      <Hero />
      <Projects />
      <HowItWorks />
      <FrequentlyAskedQuestions />
      <ContactRoot />
    </div>
  );
};

export default HomeRoot;
