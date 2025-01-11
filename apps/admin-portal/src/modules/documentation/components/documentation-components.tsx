import React, { FC } from 'react';
import classNames from 'classnames';
import { Separator } from '@repo/react-web-ui-shadcn/components/ui/separator';

import { ComponentBaseProps } from '@/interfaces/component.interface';

import PageHeader from '@/components/pages/page-header';

const DocumentationComponents: FC<ComponentBaseProps> = ({ className }) => {
  return (
    <div className={classNames('flex grow flex-col rounded-lg border bg-card p-4 text-card-foreground shadow-sm', className)}>
      <PageHeader title="Components" description="Components" />
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <h1>Components</h1>
      </div>
    </div>
  );
};

export default DocumentationComponents;
