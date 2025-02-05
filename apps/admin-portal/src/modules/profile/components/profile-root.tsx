import { FC } from 'react';
import classNames from 'classnames';
import { NavLink, useLocation, useSearchParams } from 'react-router-dom';
import { useLocale, useTranslations } from 'use-intl';
import { buttonVariants } from '@repo/react-web-ui-shadcn/components/ui/button';
import { Separator } from '@repo/react-web-ui-shadcn/components/ui/separator';
import { objectToQueryString } from '@repo/shared-universal/utils/string.util';
import { useQuery } from '@tanstack/react-query';

import { ComponentBaseProps } from '@/interfaces/component.interface';

import { QUERY_PROFILE_ME } from '../constants/profile.constant';

import Box from '@/components/box';
import CommingSoon from '@/components/comming-soon';

import { useAuthState } from '@/modules/auth/states/auth.state';

import ProfileAboutMe from './profile-about-me';
import ProfileAvatar from './profile-avatar';
import ProfileCover from './profile-cover';
import ProfileForm from './profile-form';
import ProfileName from './profile-name';
import ProfileNavigation from './profile-navigation';
import ProfilePhotos from './profile-photos';

import ProfileApi from '../api/profile.api';

const ProfileRoot: FC<ComponentBaseProps> = ({ className }) => {
  const t = useTranslations();
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();
  const locale = useLocale();
  const authState = useAuthState();

  const { data: user } = useQuery({
    queryKey: [QUERY_PROFILE_ME],
    queryFn: async () => {
      const res = await ProfileApi.me();

      return res.data.data;
    },
    staleTime: 0,
  });

  if (!authState.user || !user) return null;

  const routes = {
    [`/${locale}/profile/overview`]: (
      <div className="grid grid-cols-12 gap-4">
        <ProfileAboutMe className="col-span-12 xl:col-span-7 2xl:col-span-8" user={user} />
        <ProfilePhotos className="col-span-12 xl:col-span-5 2xl:col-span-4" />
      </div>
    ),
    [`/${locale}/profile/edit`]: (
      <div className="grid grid-cols-12 gap-4">
        <ProfileForm className="col-span-12 xl:col-span-7 2xl:col-span-8" user={user} />
      </div>
    ),
    [`/${locale}/profile/posts`]: <CommingSoon />,
    [`/${locale}/profile/activities`]: <CommingSoon />,
  };

  return (
    <div className={classNames('flex flex-col gap-3', className)}>
      <Box spacing={false}>
        <ProfileCover user={authState.user} />
        <div className="relative flex items-center justify-between px-4">
          <div className="flex items-end gap-3">
            <ProfileAvatar className="-mt-14" />
            <ProfileName user={authState.user} />
          </div>
          <div className="ml-auto mt-6">
            <NavLink
              className={buttonVariants()}
              to={{
                pathname: `/${locale}/profile/edit`,
                search: `?${objectToQueryString({ sidebar: searchParams.get('sidebar') })}`,
              }}
            >
              {t('profile_edit')}
            </NavLink>
          </div>
        </div>
        <Separator className="mt-6" />
        <ProfileNavigation />
      </Box>
      <Box spacing={false} flat={true}>
        {routes[pathname] || null}
      </Box>
    </div>
  );
};

export default ProfileRoot;
