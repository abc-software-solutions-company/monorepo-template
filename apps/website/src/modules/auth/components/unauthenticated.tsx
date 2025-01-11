'use client';

import React, { FC } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@repo/react-web-ui-shadcn/components/ui/button';

import { useRouter } from '@/navigation';

import { ComponentBaseProps } from '@/interfaces/component.interface';

const Unauthenticated: FC<ComponentBaseProps> = ({ visible = false, ...rest }) => {
  const router = useRouter();
  const t = useTranslations();

  if (!visible) return null;

  return (
    <div className="flex items-center gap-x-3" data-testid="unauthenticated" {...rest}>
      <Button className="rounded-full" data-testid="btn-signin" onClick={() => router.push({ pathname: '/sign-in' })}>
        {t('signin')}
      </Button>
    </div>
  );
};

export default Unauthenticated;
