import React, { FC } from 'react';
import { useParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { LanguagesIcon } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@repo/react-web-ui-shadcn/components/ui/dropdown-menu';
import { cn } from '@repo/react-web-ui-shadcn/lib/utils';
import { LANGUAGE_LABELS } from '@repo/shared-universal/constants/language.constant';

import { usePathname, useRouter } from '@/navigation';

type LanguagesProps = {
  className?: string;
  visibled?: boolean;
};

const Languages: FC<LanguagesProps> = ({ className, visibled = true }) => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const currentLocale = useLocale();

  const getLocaleLabel = (locale: string) => {
    return LANGUAGE_LABELS[locale];
  };

  const handleChangeLanguage = (locale: string) => {
    if (locale === currentLocale) return;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    router.replace({ pathname, params }, { locale });
  };

  if (!visibled) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button aria-label="btn-change-language" className={cn('items-center space-x-2 p-2', className)} data-testid="language-dropdown-trigger">
          <LanguagesIcon className="size-4" />
          <span>{getLocaleLabel(currentLocale)}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40">
        <DropdownMenuItem
          className={`flex items-center space-x-2 ${currentLocale === 'vi-vn' && 'bg-primary'}`}
          data-testid="vi-vn-flag"
          onClick={() => handleChangeLanguage('vi-vn')}
        >
          <span>Vietnamese</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className={`flex items-center space-x-2 ${currentLocale === 'en-us' && 'bg-primary'}`}
          data-testid="en-us-flag"
          onClick={() => handleChangeLanguage('en-us')}
        >
          <span>English</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Languages;
