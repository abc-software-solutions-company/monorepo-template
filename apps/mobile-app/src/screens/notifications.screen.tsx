import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native-gesture-handler';
import { ds } from '~react-native-design-system';
import { dynamicStyles } from '~react-native-design-system/utils/style.util';
import Divider from '~react-native-ui-core/components/divider';
import Heading from '~react-native-ui-core/components/heading';
import Link from '~react-native-ui-core/components/link';
import StatusBar from '~react-native-ui-core/components/statusbar';
import View from '~react-native-ui-core/components/view';
import { useCoreUITheme } from '~react-native-ui-core/themes/theme.context';

import Box from '@/components/box';

import NavigationHeader from '@/modules/navigation/components/navigation-header';
import { NotificationStackProps } from '@/modules/navigation/interfaces/navigation.interface';
import { getHeaderTitle } from '@/modules/navigation/utils/navigation.util';
import NotificationsRoot from '@/modules/notifications/components/notifications-root';

function NotificationsScreen({ route }: NotificationStackProps<'Notifications'>) {
  const { t } = useTranslation();
  const { configs } = useCoreUITheme();

  const backgroundColor = configs.background;

  return (
    <View style={[ds.flex1, dynamicStyles.background(backgroundColor)]}>
      <StatusBar />
      <NavigationHeader title={t(getHeaderTitle(route.name))} />
      <Box hasBg={false} style={ds.flex1}>
        <Box style={ds.flex1}>
          <View style={[ds.row, ds.itemsCenter, ds.justifyBetween]}>
            <Heading as="h4" fontWeight="Medium" text="Account Notifications" />
            <Link text="See All" color={configs.primary[500]} onPress={() => {}} />
          </View>
          <Divider height={20} />
          <ScrollView showsVerticalScrollIndicator={false}>
            <NotificationsRoot />
          </ScrollView>
        </Box>
      </Box>
    </View>
  );
}

export default NotificationsScreen;
