import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native-gesture-handler';
import { ds } from '~react-native-design-system';
import StatusBar from '~react-native-ui-core/components/statusbar';
import View from '~react-native-ui-core/components/view';

import NavigationHeader from '@/modules/navigation/components/navigation-header';
import { ProfileStackProps } from '@/modules/navigation/interfaces/navigation.interface';
import { getHeaderTitle } from '@/modules/navigation/utils/navigation.util';
import ProfileRoot from '@/modules/profile/conponents/profile-root';

function ProfileScreen({ route }: ProfileStackProps<'Profile'>) {
  const { t } = useTranslation();

  return (
    <View style={ds.flex1}>
      <StatusBar />
      <NavigationHeader title={t(getHeaderTitle(route.name))} />
      <ScrollView showsVerticalScrollIndicator={false} style={ds.p14}>
        <ProfileRoot />
      </ScrollView>
    </View>
  );
}

export default ProfileScreen;
