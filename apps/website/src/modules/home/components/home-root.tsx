import React, { FC } from 'react';
import classNames from 'classnames';

import { ComponentBaseProps } from '@/interfaces/component.interface';

import ContactRoot from '@/modules/contacts/components/contact-root';
import { FrequentlyAskedQuestions } from '@/modules/home/components/frequently-asked-questions';
import NewsLetterRoot from '@/modules/news-letter/components/new-letter-root';

import CallToAction from './call-to-action';
import Hero from './hero';
import HowItWorks from './how-it-works';
import Projects from './projects';

const HomeRoot: FC<ComponentBaseProps> = ({ className }) => {
  return (
    <div className={classNames(className)}>
      <Hero />
      <Projects />
      <HowItWorks />
      <CallToAction />
      <NewsLetterRoot />
      <FrequentlyAskedQuestions />
      <ContactRoot />
    </div>
  );
};

export default HomeRoot;
