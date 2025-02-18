import { FC } from 'react';
import classNames from 'classnames';
import { LogOutIcon, UserIcon } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLocale, useTranslations } from 'use-intl';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/react-web-ui-shadcn/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/react-web-ui-shadcn/components/ui/dropdown-menu';
import { getShortName, objectToQueryString } from '@repo/shared-universal/utils/string.util';

import { ComponentBaseProps } from '@/interfaces/component.interface';

import { IMAGE_AVATAR_URL } from '@/constants/file.constant';

import { useAuthState } from '@/modules/auth/states/auth.state';

const HeaderProfile: FC<ComponentBaseProps> = ({ className }) => {
  const t = useTranslations();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const locale = useLocale();
  const { user, signOut } = useAuthState();

  const shortName = getShortName(user?.name);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={IMAGE_AVATAR_URL + user?.avatar} alt={user?.name} />
          <AvatarFallback
            className={classNames('font-bold text-white', 'animate-gradient bg-[linear-gradient(-45deg,_#1255E5,_#1255E5)] bg-[length:400%_400%]')}
          >
            {shortName}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={classNames('w-56', className)} side="bottom" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1 px-1.5 pb-1">
            <p className="text-sm font-medium leading-none">
              <strong className="text-base">{user?.name}</strong>
            </p>
            <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer gap-x-2 py-2.5"
          onClick={() =>
            navigate({
              pathname: `${locale}/profile/overview`,
              search: `?${objectToQueryString({ sidebar: searchParams.get('sidebar') })}`,
            })
          }
        >
          <UserIcon strokeWidth={1.5} size={20} />
          {t('profile')}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer gap-x-2 py-2.5" onClick={() => signOut()}>
          <LogOutIcon strokeWidth={1.5} size={20} />
          {t('signout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HeaderProfile;
