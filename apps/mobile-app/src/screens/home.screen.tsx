import React from 'react';
import { Image, ImageSourcePropType, ImageStyle } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { ds } from '@repo/react-native-design-system';
import Divider from '@repo/react-native-ui-core/components/divider';
import Heading from '@repo/react-native-ui-core/components/heading';
import StatusBar from '@repo/react-native-ui-core/components/statusbar';
import Text from '@repo/react-native-ui-core/components/text';

import SafeViewArea from '@/components/safe-view-area';

import { TravelExploreStackProps } from '@/modules/navigation/interfaces/navigation.interface';
import { TravelCategories, TravelCategoryList, TravelCategoryTrigger } from '@/modules/travel-categories/components/travel-categories';
import TravelHeader from '@/modules/travel-common/components/travel-header';
import TravelPlacesRoot from '@/modules/travel-places/components/travel-places-root';
import PopularHotelsRoot from '@/modules/travel-popular-hotels/components/popular-hotel-root';

function HomeScreen({}: TravelExploreStackProps<'Home'>) {
  const travelCategories = [
    { id: '1', name: 'Asia', image: require('@/assets/travels/category-asia.jpeg') },
    { id: '2', name: 'Europe', image: require('@/assets/travels/category-europe.jpeg') },
    { id: '3', name: 'America', image: require('@/assets/travels/category-america.jpeg') },
    { id: '4', name: 'Australia', image: require('@/assets/travels/category-australia.jpeg') },
    { id: '5', name: 'Africa', image: require('@/assets/travels/category-africa.jpeg') },
  ];

  return (
    <SafeViewArea>
      <StatusBar background="transparent" />
      <TravelHeader />
      <Divider height={2} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Divider height={14} />
        <Heading as="h3" fontWeight="Medium" text="Categories" style={ds.px14} />
        <Divider height={4} />
        <TravelCategories defaultValue={travelCategories[0].id} onChange={_id => {}}>
          <TravelCategoryList style={[ds.row, ds.gap8, ds.px14, ds.py10]}>
            {travelCategories?.map(item => (
              <TravelCategoryTrigger key={item.id} style={[ds.p4, ds.rounded10, ds.w84]} value={item.id}>
                <>
                  <Image style={[ds.wFull, ds.h56, ds.rounded8] as ImageStyle} source={item.image as ImageSourcePropType} />
                  <Text fontWeight="Bold" style={[ds.textCenter, ds.text14]}>
                    {item.name}
                  </Text>
                </>
              </TravelCategoryTrigger>
            ))}
          </TravelCategoryList>
        </TravelCategories>
        <Divider height={14} />
        <TravelPlacesRoot />
        <Divider height={14} />
        <PopularHotelsRoot />
        <Divider height={14} />
      </ScrollView>
    </SafeViewArea>
  );
}

export default HomeScreen;
