import React from 'react';
import { useTranslation } from 'react-i18next';
import { ds } from '~react-native-design-system';
import StatusBar from '~react-native-ui-core/components/statusbar';
import View from '~react-native-ui-core/components/view';

import Box from '@/components/box';

import NavigationHeader from '@/modules/navigation/components/navigation-header';
import { ProfileStackProps } from '@/modules/navigation/interfaces/navigation.interface';
import { getHeaderTitle } from '@/modules/navigation/utils/navigation.util';
import ProfileEditRoot from '@/modules/profile/conponents/profile-edit-root';

function ProfileEditScreen({ route }: ProfileStackProps<'ProfileEdit'>) {
  const { t } = useTranslation();

  return (
    <View style={ds.flex1}>
      <StatusBar />
      <NavigationHeader title={t(getHeaderTitle(route.name))} />
      <Box hasBg={false} style={ds.flex1}>
        <Box style={ds.flex1}>
          <ProfileEditRoot />
        </Box>
      </Box>
    </View>
  );
}

export default ProfileEditScreen;
