import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native-gesture-handler';
import { ds } from '~react-native-design-system';
import { dynamicStyles } from '~react-native-design-system/utils/style.util';
import Heading from '~react-native-ui-core/components/heading';
import StatusBar from '~react-native-ui-core/components/statusbar';
import View from '~react-native-ui-core/components/view';
import { useCoreUITheme } from '~react-native-ui-core/themes/theme.context';

import Box from '@/components/box';
import SearchBox from '@/components/search-box';

import NavigationHeader from '@/modules/navigation/components/navigation-header';
import { AuthenticatedStackProps } from '@/modules/navigation/interfaces/navigation.interface';
import { getHeaderTitle } from '@/modules/navigation/utils/navigation.util';

function SearchScreen({ route }: AuthenticatedStackProps<'Search'>) {
  const { t } = useTranslation();
  const { configs } = useCoreUITheme();

  return (
    <View style={[ds.flex1, dynamicStyles.background(configs.background)]}>
      <StatusBar />
      <NavigationHeader title={t(getHeaderTitle(route.name))} />
      <Box hasBg={false}>
        <SearchBox value={''} />
      </Box>
      <Heading>Recently Search:</Heading>
      <ScrollView showsVerticalScrollIndicator={false} style={[ds.p14]} />
    </View>
  );
}

export default SearchScreen;
