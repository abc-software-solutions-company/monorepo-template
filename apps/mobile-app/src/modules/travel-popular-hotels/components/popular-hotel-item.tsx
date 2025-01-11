import React, { FC } from 'react';
import { MapPin } from 'lucide-react-native';
import { Image, ImageSourcePropType, ImageStyle, Pressable } from 'react-native';
import { Colors, ds } from '@repo/react-native-design-system';
import { dynamicStyles } from '@repo/react-native-design-system/utils/style.util';
import Text from '@repo/react-native-ui-core/components/text';
import View from '@repo/react-native-ui-core/components/view';
import { useCoreUITheme } from '@repo/react-native-ui-core/themes/theme.context';

import IconStarSolid from '@/components/svgs/ico-star-solid';

import { AccommodationEntity } from '@/modules/travel-accommodations/interfaces/accommodations.interface';

type PopularHotelItemProps = {
  item: AccommodationEntity;
  onPress?: () => void;
};

const PopularHotelItem: FC<PopularHotelItemProps> = ({ item, onPress }) => {
  const { configs } = useCoreUITheme();

  return (
    <Pressable style={[ds.row, ds.gap10, ds.p6, ds.rounded24, dynamicStyles.background(configs.card)]} onPress={onPress}>
      <>
        <Image style={[ds.w112, ds.h112, ds.rounded20] as ImageStyle} source={item.image as ImageSourcePropType} />
        <View style={[ds.px10, ds.py6, ds.column, ds.justifyBetween]}>
          <View>
            <Text fontWeight="Bold" fontSize={20}>
              {item.name}
            </Text>
            <View style={[ds.row, ds.itemsCenter, ds.gap2, ds.mt2]}>
              <MapPin color={configs.secondaryForeground} size={18} strokeWidth={1.5} />
              <Text color={configs.secondaryForeground} style={[ds.text14]}>
                {item.location}
              </Text>
            </View>
            <View style={[ds.row, ds.itemsCenter, ds.gap4]}>
              <IconStarSolid width={20} color={Colors.amber[500]} />
              <Text fontWeight="Bold" fontSize={14}>
                {item.rating}
              </Text>
            </View>
          </View>

          <View style={ds.row}>
            <Text color={configs.primary[500]} fontWeight="Bold">{`$${item.price}`}</Text>
            <Text fontSize={13}>/night</Text>
          </View>
        </View>
      </>
    </Pressable>
  );
};

export default PopularHotelItem;
