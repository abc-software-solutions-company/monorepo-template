import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native-gesture-handler';
import { ds } from '@repo/react-native-design-system';
import { dynamicStyles } from '@repo/react-native-design-system/utils/style.util';
import Icon from '@repo/react-native-ui-core/components/icon';
import StatusBar from '@repo/react-native-ui-core/components/statusbar';
import { useCoreUITheme } from '@repo/react-native-ui-core/themes/theme.context';

import Box from '@/components/box';
import SafeViewArea from '@/components/safe-view-area';
import SearchBox from '@/components/search-box';

import NavigationHeader from '@/modules/navigation/components/navigation-header';
import { AuthenticatedStackProps } from '@/modules/navigation/interfaces/navigation.interface';
import { getHeaderTitle } from '@/modules/navigation/utils/navigation.util';

function SearchScreen({ navigation, route }: AuthenticatedStackProps<'Search'>) {
  const { t } = useTranslation();
  const { configs } = useCoreUITheme();

  return (
    <SafeViewArea style={dynamicStyles.background(configs.background)}>
      <StatusBar />
      <NavigationHeader title={t(getHeaderTitle(route.name))} leftFunc={() => navigation.goBack()} leftComponent={<Icon name="ChevronLeft" />} />
      <Box hasBg={false}>
        <SearchBox value={''} />
        <ScrollView showsVerticalScrollIndicator={false} style={[ds.p14]} />
      </Box>
    </SafeViewArea>
  );
}

export default SearchScreen;
