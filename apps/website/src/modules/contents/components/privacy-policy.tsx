'use client';

import React, { FC } from 'react';
import classNames from 'classnames';

import { ComponentBaseProps } from '@/interfaces/component.interface';
import { ContentEntity } from '../interfaces/contents.interface';

type PrivacyPolicyProps = {
  data: ContentEntity;
} & ComponentBaseProps;

const PrivacyPolicy: FC<PrivacyPolicyProps> = ({ className, data }) => {
  return (
    <div className={classNames('py-12', className)}>
      <div className="container">
        <h1 className="mb-6 text-center text-3xl font-bold md:text-4xl">{data?.name}</h1>
        <div className="wysiwyg prose" dangerouslySetInnerHTML={{ __html: data?.body ?? '' }} />
      </div>
    </div>
  );
};

export default PrivacyPolicy;
