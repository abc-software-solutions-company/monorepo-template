import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native-gesture-handler';
import { ds } from '~react-native-design-system';
import StatusBar from '~react-native-ui-core/components/statusbar';
import View from '~react-native-ui-core/components/view';

import Box from '@/components/box';
import SafeViewArea from '@/components/safe-view-area';

import NavigationHeader from '@/modules/navigation/components/navigation-header';
import { AuthenticatedStackProps } from '@/modules/navigation/interfaces/navigation.interface';
import { getHeaderTitle } from '@/modules/navigation/utils/navigation.util';
import TermsAndConditions from '@/modules/terms-and-conditions/components/terms-and-conditions';

function TermsAndConditionsScreen({ route }: AuthenticatedStackProps<'TermsAndConditions'>) {
  const { t } = useTranslation();

  return (
    <View style={ds.flex1}>
      <StatusBar />
      <NavigationHeader title={t(getHeaderTitle(route.name))} />
      <SafeViewArea spacingBottom={true}>
        <Box hasBg={false} style={ds.flex1}>
          <Box style={ds.flex1}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <TermsAndConditions />
            </ScrollView>
          </Box>
        </Box>
      </SafeViewArea>
    </View>
  );
}

export default TermsAndConditionsScreen;
