import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native-gesture-handler';
import { ds } from '~react-native-design-system';
import Divider from '~react-native-ui-core/components/divider';
import StatusBar from '~react-native-ui-core/components/statusbar';
import View from '~react-native-ui-core/components/view';

import Box from '@/components/box';
import SearchBox from '@/components/search-box';

import HelpCenter from '@/modules/help-center/components/help-center';
import NavigationHeader from '@/modules/navigation/components/navigation-header';
import { AuthenticatedStackProps } from '@/modules/navigation/interfaces/navigation.interface';
import { getHeaderTitle } from '@/modules/navigation/utils/navigation.util';

function HelpCenterScreen({ route }: AuthenticatedStackProps<'HelpCenter'>) {
  const { t } = useTranslation();

  return (
    <View style={ds.flex1}>
      <StatusBar />
      <NavigationHeader title={t(getHeaderTitle(route.name))} />
      <Box hasBg={false} style={ds.flex1}>
        <Box style={ds.flex1}>
          <SearchBox value={''} onChange={_text => {}} />
          <Divider />
          <ScrollView contentInsetAdjustmentBehavior="automatic" showsVerticalScrollIndicator={false}>
            <HelpCenter />
          </ScrollView>
        </Box>
      </Box>
    </View>
  );
}

export default HelpCenterScreen;
