import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native-gesture-handler';
import { ds } from '@repo/react-native-design-system';
import Icon from '@repo/react-native-ui-core/components/icon';
import StatusBar from '@repo/react-native-ui-core/components/statusbar';

import Box from '@/components/box';
import SafeViewArea from '@/components/safe-view-area';

import NavigationHeader from '@/modules/navigation/components/navigation-header';
import { AuthenticatedStackProps } from '@/modules/navigation/interfaces/navigation.interface';
import { getHeaderTitle } from '@/modules/navigation/utils/navigation.util';
import PrivacyPolicy from '@/modules/privacy-policy/components/privacy-policy';

function PrivacyPolicyScreen({ navigation, route }: AuthenticatedStackProps<'PrivacyPolicy'>) {
  const { t } = useTranslation();

  return (
    <SafeViewArea spacingBottom={true}>
      <StatusBar />
      <NavigationHeader title={t(getHeaderTitle(route.name))} leftFunc={() => navigation.goBack()} leftComponent={<Icon name="ChevronLeft" />} />
      <Box hasBg={false} style={ds.flex1}>
        <Box style={ds.flex1}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <PrivacyPolicy />
          </ScrollView>
        </Box>
      </Box>
    </SafeViewArea>
  );
}

export default PrivacyPolicyScreen;
