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

type HelperTextProps = {
  text?: string;
  className?: string;
};

export function HelperText({ className, text }: HelperTextProps) {
  if (!text) return null;

  return (
    <div className={cn('flex items-center gap-1 text-xs font-medium text-cyan-600', className)}>
      <InfoIcon className="size-4" />
      {text}
    </div>
  );
}

type CharacterCountProps = {
  current: number;
  max?: number;
  className?: string;
  visibled?: boolean;
};

export function CharacterCount({ className, current, max, visibled }: CharacterCountProps) {
  if (!visibled || !max) return null;

  return (
    <div className={cn('text-xs font-medium text-muted-foreground', className)}>
      {current}/{max}
    </div>
  );
}
