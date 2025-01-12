import React, { FC } from 'react';
import { InfoIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@repo/react-web-ui-shadcn/components/ui/tooltip';

import { ComponentBaseProps } from '@/interfaces/component.interface';

type TooltipInfoProps = {
  text: string;
} & ComponentBaseProps;

const TooltipInfo: FC<TooltipInfoProps> = ({ text }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <InfoIcon className="h-4 w-4 text-cyan-500" />
        </TooltipTrigger>
        <TooltipContent>
          <p>{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TooltipInfo;
