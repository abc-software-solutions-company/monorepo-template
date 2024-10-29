import { FC } from 'react';
import { CircleCheckBigIcon } from 'lucide-react';

import { TranslationValue } from '@/modules/multi-step-form/interfaces/campaign.interface';

export const CheckIndicator: FC<{ className?: string; values: TranslationValue[]; lang: string }> = ({ className, values = [], lang }) => {
  const hasValue = values.find(item => item.lang === lang)?.value?.trim();

  if (!hasValue) return null;

  return <CircleCheckBigIcon size={12} className={className} />;
};
