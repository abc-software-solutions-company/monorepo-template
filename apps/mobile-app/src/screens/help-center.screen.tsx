import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native-gesture-handler';
import { ds } from '@repo/react-native-design-system';
import Divider from '@repo/react-native-ui-core/components/divider';
import Icon from '@repo/react-native-ui-core/components/icon';
import StatusBar from '@repo/react-native-ui-core/components/statusbar';

import Box from '@/components/box';
import SafeViewArea from '@/components/safe-view-area';
import SearchBox from '@/components/search-box';

import HelpCenterRoot from '@/modules/help-center/components/help-center-root';
import NavigationHeader from '@/modules/navigation/components/navigation-header';
import { AuthenticatedStackProps } from '@/modules/navigation/interfaces/navigation.interface';
import { getHeaderTitle } from '@/modules/navigation/utils/navigation.util';

function HelpCenterScreen({ navigation, route }: AuthenticatedStackProps<'HelpCenter'>) {
  const { t } = useTranslation();

  return (
    <SafeViewArea spacingBottom={true}>
      <StatusBar />
      <NavigationHeader title={t(getHeaderTitle(route.name))} leftFunc={() => navigation.goBack()} leftComponent={<Icon name="ChevronLeft" />} />
      <Box style={ds.flex1}>
        <SearchBox value={''} onChange={_text => {}} />
        <Divider />
        <ScrollView showsVerticalScrollIndicator={false}>
          <HelpCenterRoot />
        </ScrollView>
      </Box>
    </SafeViewArea>
  );
}

export default HelpCenterScreen;
