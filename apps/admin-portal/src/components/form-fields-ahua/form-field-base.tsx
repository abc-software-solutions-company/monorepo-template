import { FC } from 'react';
import { CircleCheckBigIcon, InfoIcon } from 'lucide-react';
import { cn } from '~react-web-ui-shadcn/lib/utils';

import { TranslationValue } from '@/interfaces/language.interface';

type CheckIndicatorProps = {
  className?: string;
  values: TranslationValue[];
  lang: string;
  error?: boolean;
};

export const CheckIndicator: FC<CheckIndicatorProps> = ({ className, values = [], lang, error }) => {
  const hasValue = values.find(item => item.lang === lang)?.value?.trim();

  if (!hasValue) return null;

  if (error) {
    return <InfoIcon size={12} className={cn(className, 'text-destructive')} />;
  } else {
    return <CircleCheckBigIcon size={12} className={cn(className, 'text-primary')} />;
  }
};
