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
      <div id="hero" className="min-h-screen">
        <Hero />
      </div>
      <div id="projects" className="min-h-screen">
        <Projects />
      </div>
      <div id="how-it-works" className="min-h-screen">
        <HowItWorks />
      </div>
      <div id="faq" className="min-h-screen">
        <FrequentlyAskedQuestions />
      </div>
      <div id="contact" className="min-h-screen">
        <ContactRoot />
      </div>
    </div>
  );
};

export default HomeRoot;
