import React, { FC } from 'react';
import classNames from 'classnames';
import { TimerIcon } from 'lucide-react';

import { ComponentBaseProps } from '@/interfaces/component.interface';

type CommingSoonProps = {
  data?: unknown;
} & ComponentBaseProps;

const CommingSoon: FC<CommingSoonProps> = ({ className }) => {
  return (
    <div className={classNames('my-10 flex grow items-center justify-center', className)}>
      <div>
        <TimerIcon className="mx-auto mb-2" size={80} strokeWidth={1} />
        <h1 className="text-center">Comming soon</h1>
      </div>
    </div>
  );
};

export default CommingSoon;
