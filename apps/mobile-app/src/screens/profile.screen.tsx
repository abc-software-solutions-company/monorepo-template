import React from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '@repo/react-native-ui-core/components/icon';
import StatusBar from '@repo/react-native-ui-core/components/statusbar';

import SafeViewArea from '@/components/safe-view-area';

import NavigationHeader from '@/modules/navigation/components/navigation-header';
import { ProfileStackProps } from '@/modules/navigation/interfaces/navigation.interface';
import { getHeaderTitle } from '@/modules/navigation/utils/navigation.util';
import ProfileRoot from '@/modules/profile/conponents/profile-root';

function ProfileScreen({ navigation, route }: ProfileStackProps<'Profile'>) {
  const { t } = useTranslation();

  return (
    <SafeViewArea>
      <StatusBar />
      <NavigationHeader title={t(getHeaderTitle(route.name))} leftFunc={() => navigation.goBack()} leftComponent={<Icon name="ChevronLeft" />} />
      <ProfileRoot />
    </SafeViewArea>
  );
}

export default ProfileScreen;
