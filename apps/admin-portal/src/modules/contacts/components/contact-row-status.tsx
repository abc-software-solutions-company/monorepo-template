import { FC } from 'react';
import classNames from 'classnames';
import { Tooltip, TooltipProvider, TooltipTrigger } from '@repo/react-web-ui-shadcn/components/ui/tooltip';

import { ComponentBaseProps } from '@/interfaces/component.interface';
import { OptionType } from '@/interfaces/status.interface';

type ContactRowStatusProps = {
  value: string;
  items: OptionType[];
} & ComponentBaseProps;

const ContactRowStatus: FC<ContactRowStatusProps> = ({ className, items, value }) => {
  const status = items.find(item => item.value === value);

  return (
    <div className={classNames(className)}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={classNames(
                'inline-flex items-center gap-x-1 rounded px-2 py-1',
                status?.textClassName,
                status?.bgClassName,
                status?.borderClassName
              )}
            >
              <strong>{status?.label.toUpperCase()}</strong>
            </div>
          </TooltipTrigger>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default ContactRowStatus;
