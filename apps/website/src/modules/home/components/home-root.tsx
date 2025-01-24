import React, { FC } from 'react';
import classNames from 'classnames';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@repo/react-web-ui-shadcn/components/ui/select';

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
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="blueberry">Blueberry</SelectItem>
            <SelectItem value="grapes">Grapes</SelectItem>
            <SelectItem value="pineapple">Pineapple</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default HomeRoot;
