import React from 'react';
import { useTranslation } from 'react-i18next';
import { ds } from '@repo/react-native-design-system';
import Icon from '@repo/react-native-ui-core/components/icon';
import StatusBar from '@repo/react-native-ui-core/components/statusbar';

import Box from '@/components/box';
import SafeViewArea from '@/components/safe-view-area';

import NavigationHeader from '@/modules/navigation/components/navigation-header';
import { ProfileStackProps } from '@/modules/navigation/interfaces/navigation.interface';
import { getHeaderTitle } from '@/modules/navigation/utils/navigation.util';
import ProfileEditRoot from '@/modules/profile/conponents/profile-edit-root';

function ProfileEditScreen({ navigation, route }: ProfileStackProps<'ProfileEdit'>) {
  const { t } = useTranslation();

  return (
    <SafeViewArea>
      <StatusBar />
      <NavigationHeader title={t(getHeaderTitle(route.name))} leftFunc={() => navigation.goBack()} leftComponent={<Icon name="ChevronLeft" />} />
      <Box hasBg={false} style={ds.flex1}>
        <ProfileEditRoot />
      </Box>
    </SafeViewArea>
  );
}

export default ProfileEditScreen;
