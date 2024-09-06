'use client';

import React, { FC } from 'react';
import { useTranslations } from 'next-intl';
import classNames from 'classnames';

import { ComponentBaseProps } from '@/interfaces/component.interface';

import ContactForm from './contact-form';

const ContactRoot: FC<ComponentBaseProps> = ({ className }) => {
  const t = useTranslations();

  return (
    <section id="contact" className={classNames('bg-muted/50 py-14 sm:py-16', className)}>
      <div className="container">
        <h2 className="text-center text-3xl font-bold md:text-4xl">
          <span className="bg-gradient-to-b from-primary/60 to-primary bg-clip-text text-transparent">{t('contact_us')}</span>
        </h2>
        <h3 className="pb-8 pt-4 text-center text-xl text-muted-foreground">{t('contact_description')}</h3>
        <ContactForm className="mx-auto max-w-4xl" />
      </div>
    </section>
  );
};

export default ContactRoot;
