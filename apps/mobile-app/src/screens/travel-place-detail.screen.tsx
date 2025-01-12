import React from 'react';
import { useTranslation } from 'react-i18next';
import { ds } from '@repo/react-native-design-system';
import Icon from '@repo/react-native-ui-core/components/icon';
import StatusBar from '@repo/react-native-ui-core/components/statusbar';

import SafeViewArea from '@/components/safe-view-area';

import NavigationHeader from '@/modules/navigation/components/navigation-header';
import { TravelExploreStackProps } from '@/modules/navigation/interfaces/navigation.interface';
import { getHeaderTitle } from '@/modules/navigation/utils/navigation.util';
import TravelPlaceDetailRoot from '@/modules/travel-places/components/travel-place-detail-root';

function TravelPlaceDetailScreen({ navigation, route }: TravelExploreStackProps<'TravelPlaceDetail'>) {
  const { t } = useTranslation();

  return (
    <SafeViewArea>
      <StatusBar />
      <NavigationHeader title={t(getHeaderTitle(route.name))} leftFunc={() => navigation.goBack()} leftComponent={<Icon name="ChevronLeft" />} />
      <TravelPlaceDetailRoot routeParams={route.params} style={ds.flex1} />
    </SafeViewArea>
  );
}

export default TravelPlaceDetailScreen;
