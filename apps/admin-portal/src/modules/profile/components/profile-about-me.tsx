import { FC } from 'react';
import classNames from 'classnames';
import { useLocale, useTranslations } from 'use-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/react-web-ui-shadcn/components/ui/card';
import { Separator } from '@repo/react-web-ui-shadcn/components/ui/separator';
import { toDateTime } from '@repo/shared-universal/utils/date.util';

import { ComponentBaseProps } from '@/interfaces/component.interface';

import { useAppData } from '@/modules/app-data/hooks/use-app-data';
import { UserEntity } from '@/modules/users/interfaces/users.interface';

type ProfileAboutMeProps = ComponentBaseProps & {
  user: UserEntity;
};

const ProfileAboutMe: FC<ProfileAboutMeProps> = ({ className, user }) => {
  const t = useTranslations();
  const locale = useLocale();
  const { countries } = useAppData();

  const selectCountryByCode = (value: string) => countries.find(x => x.code === value);

  return (
    <div className={classNames('about-info', className)}>
      <Card>
        <CardHeader>
          <CardTitle>{t('profile_about_me')}</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="p-4">
          <div className="mb-4">
            <h3 className="mb-2 font-bold uppercase">{t('profile_bio')}</h3>
            <p>{user.bio ?? t('unknown')}</p>
          </div>
          <div className="grid max-w-5xl grid-cols-2 gap-3">
            <div className="flex flex-col">
              <h3 className="mb-2 font-bold uppercase">{t('profile_email')}</h3>
              <p>{user.email}</p>
            </div>
            <div className="flex flex-col">
              <h3 className="mb-2 font-bold uppercase">{t('profile_phone_number')}</h3>
              <p>{user.phoneNumber ?? t('unknown')}</p>
            </div>
            <div className="flex flex-col">
              <h3 className="mb-2 font-bold uppercase">{t('profile_date_of_birth')}</h3>
              <p>{user.dateOfBirth ? toDateTime(new Date(user.dateOfBirth), locale, false) : t('unknown')}</p>
            </div>

            <div className="flex flex-col">
              <h3 className="mb-2 font-bold uppercase">{t('profile_country')}</h3>
              <p>{selectCountryByCode(user.country)?.name ?? t('unknown')}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileAboutMe;
