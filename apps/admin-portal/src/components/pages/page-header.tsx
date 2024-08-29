import { FC } from 'react';
import classNames from 'classnames';

import { ComponentBaseProps } from '@/interfaces/component.interface';

type PageHeaderProps = {
  title: string;
  description: string;
} & ComponentBaseProps;

const PageHeader: FC<PageHeaderProps> = ({ className, title, description }) => {
  return (
    <div className={classNames('space-y-1', className)}>
      <h2 className="text-lg font-medium">{title}</h2>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default PageHeader;
