import React, { FC } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ds } from '@repo/react-native-design-system';
import Divider from '@repo/react-native-ui-core/components/divider';
import Heading from '@repo/react-native-ui-core/components/heading';
import Link from '@repo/react-native-ui-core/components/link';
import View from '@repo/react-native-ui-core/components/view';
import { useCoreUITheme } from '@repo/react-native-ui-core/themes/theme.context';

import { TravelPlaceEntity } from '../interfaces/travel-places.interface';

import { ExploreParamList } from '@/modules/navigation/interfaces/navigation.interface';

import TravelPlaceList from './travel-place-list';

const items = [
  {
    id: '1',
    name: 'Taj Mahal',
    location: 'Uttar Pradesh, India',
    image: require('@/assets/travels/travel-place-taj-mahal.jpeg'),
    price: 50,
  },
  {
    id: '2',
    name: 'Trang An',
    location: 'Ninh Binh, Viet Nam',
    image: require('@/assets/travels/travel-place-trang-an.jpeg'),
    price: 45,
  },
  {
    id: '3',
    name: 'Angkor Wat',
    location: 'Siem Reap, Cambodia',
    image: require('@/assets/travels/travel-place-angkor-wat.jpeg'),
    price: 45,
  },
] as TravelPlaceEntity[];

type TravelPlacesRootProps = {};

const TravelPlacesRoot: FC<TravelPlacesRootProps> = ({}) => {
  const navigation = useNavigation<StackNavigationProp<ExploreParamList>>();
  const { configs } = useCoreUITheme();

  return (
    <>
      <View style={[ds.row, ds.itemsCenter, ds.justifyBetween, ds.px14]}>
        <Heading as="h3" fontWeight="Medium" text="Travel Places" />
        <Link text="See All" color={configs.primary[500]} onPress={() => navigation.navigate('TravelPlaces', { limit: 10, page: 1, q: '' })} />
      </View>
      <Divider height={10} />
      <TravelPlaceList items={items} />
    </>
  );
};

export default TravelPlacesRoot;
