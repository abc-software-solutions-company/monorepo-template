import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native-gesture-handler';
import { ds } from '@repo/react-native-design-system';
import Divider from '@repo/react-native-ui-core/components/divider';
import Heading from '@repo/react-native-ui-core/components/heading';
import Icon from '@repo/react-native-ui-core/components/icon';
import Link from '@repo/react-native-ui-core/components/link';
import StatusBar from '@repo/react-native-ui-core/components/statusbar';
import View from '@repo/react-native-ui-core/components/view';
import { useCoreUITheme } from '@repo/react-native-ui-core/themes/theme.context';

import Box from '@/components/box';
import SafeViewArea from '@/components/safe-view-area';

import NavigationHeader from '@/modules/navigation/components/navigation-header';
import { NotificationStackProps } from '@/modules/navigation/interfaces/navigation.interface';
import { getHeaderTitle } from '@/modules/navigation/utils/navigation.util';
import NotificationsRoot from '@/modules/notifications/components/notifications-root';

function NotificationsScreen({ navigation, route }: NotificationStackProps<'Notifications'>) {
  const { t } = useTranslation();
  const { configs } = useCoreUITheme();

  return (
    <SafeViewArea>
      <StatusBar />
      <NavigationHeader title={t(getHeaderTitle(route.name))} leftFunc={() => navigation.goBack()} leftComponent={<Icon name="ChevronLeft" />} />
      <Box hasBg={false} style={ds.flex1}>
        <View style={[ds.row, ds.itemsCenter, ds.justifyBetween]}>
          <Heading as="h4" fontWeight="Medium" text="Account Notifications" />
          <Link text="See All" color={configs.primary[500]} onPress={() => {}} />
        </View>
        <Divider height={20} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <NotificationsRoot />
        </ScrollView>
      </Box>
    </SafeViewArea>
  );
}

export default NotificationsScreen;
