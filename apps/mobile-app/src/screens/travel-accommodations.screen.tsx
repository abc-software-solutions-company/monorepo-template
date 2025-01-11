import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native-gesture-handler';
import { ds } from '@repo/react-native-design-system';
import Icon from '@repo/react-native-ui-core/components/icon';
import StatusBar from '@repo/react-native-ui-core/components/statusbar';

import SafeViewArea from '@/components/safe-view-area';

import NavigationHeader from '@/modules/navigation/components/navigation-header';
import { TravelAccommodationStackProps } from '@/modules/navigation/interfaces/navigation.interface';
import { getHeaderTitle } from '@/modules/navigation/utils/navigation.util';
import AccommodationsRoot from '@/modules/travel-accommodations/components/accommodation-root';

function AccommodationsScreen({ navigation, route }: TravelAccommodationStackProps<'Accommodations'>) {
  const { t } = useTranslation();

  return (
    <SafeViewArea>
      <StatusBar />
      <NavigationHeader title={t(getHeaderTitle(route.name))} leftFunc={() => navigation.goBack()} leftComponent={<Icon name="ChevronLeft" />} />
      <ScrollView showsVerticalScrollIndicator={false} style={[ds.px12]}>
        <AccommodationsRoot />
      </ScrollView>
    </SafeViewArea>
  );
}

export default AccommodationsScreen;
