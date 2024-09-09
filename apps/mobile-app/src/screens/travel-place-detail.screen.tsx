import React from 'react';
import { useTranslation } from 'react-i18next';
import { ds } from '~react-native-design-system';
import StatusBar from '~react-native-ui-core/components/statusbar';
import View from '~react-native-ui-core/components/view';

import NavigationHeader from '@/modules/navigation/components/navigation-header';
import { TravelExploreStackProps } from '@/modules/navigation/interfaces/navigation.interface';
import { getHeaderTitle } from '@/modules/navigation/utils/navigation.util';
import TravelPlaceDetailRoot from '@/modules/travel-places/components/travel-place-detail-root';

function TravelPlaceDetailScreen({ navigation, route }: TravelExploreStackProps<'TravelPlaceDetail'>) {
  const { t } = useTranslation();

  return (
    <View style={ds.flex1}>
      <StatusBar background="transparent" />
      <NavigationHeader
        backgroundColor="transparent"
        borderColor="transparent"
        title={t(getHeaderTitle(route.name))}
        leftFunc={() => navigation.goBack()}
      />
      <TravelPlaceDetailRoot routeParams={route.params} style={ds.flex1} />
    </View>
  );
}

export default TravelPlaceDetailScreen;
