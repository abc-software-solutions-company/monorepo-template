/*
 * @Author: <Tin Tran> (tin.tran@abcdigital.io)
 * @Created: 2024-12-29 20:29:49
 */

import { FC } from 'react';
import { CircleCheckBigIcon, InfoIcon } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Translation } from '@repo/shared-universal/interfaces/language.interface';

type CheckIndicatorProps = {
  className?: string;
  values: Translation[];
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
