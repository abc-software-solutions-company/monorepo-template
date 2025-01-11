import React from 'react';
import { useTranslation } from 'react-i18next';
import { ds } from '@repo/react-native-design-system';
import Icon from '@repo/react-native-ui-core/components/icon';
import StatusBar from '@repo/react-native-ui-core/components/statusbar';

import SafeViewArea from '@/components/safe-view-area';

import NavigationHeader from '@/modules/navigation/components/navigation-header';
import { TravelTourStackProps } from '@/modules/navigation/interfaces/navigation.interface';
import { getHeaderTitle } from '@/modules/navigation/utils/navigation.util';
import TourDetailRoot from '@/modules/travel-tours/components/tour-detail-root';

function TourDetailScreen({ navigation, route }: TravelTourStackProps<'TourDetail'>) {
  const { t } = useTranslation();

  return (
    <SafeViewArea>
      <StatusBar />
      <NavigationHeader title={t(getHeaderTitle(route.name))} leftFunc={() => navigation.goBack()} leftComponent={<Icon name="ChevronLeft" />} />
      <TourDetailRoot routeParams={route.params} style={ds.flex1} />
    </SafeViewArea>
  );
}

export default TourDetailScreen;
