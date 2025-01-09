import React, { FC } from 'react';
import { Image, ImageSourcePropType, ImageStyle, Pressable } from 'react-native';
import { ds } from '~react-native-design-system';
import { dynamicStyles } from '~react-native-design-system/utils/style.util';
import Text from '~react-native-ui-core/components/text';
import View from '~react-native-ui-core/components/view';
import { useCoreUITheme } from '~react-native-ui-core/themes/theme.context';

import { TourEntity } from '../interfaces/travel-tours.interface';

type TourItemProps = {
  item: TourEntity;
  onPress?: () => void;
};

const TourItem: FC<TourItemProps> = ({ item, onPress }) => {
  const { configs } = useCoreUITheme();

  return (
    <Pressable style={[ds.grow, ds.p6, ds.w240, ds.rounded24, dynamicStyles.background(configs.card)]} onPress={onPress}>
      <Image style={[ds.wFull, ds.h144, ds.rounded20] as ImageStyle} source={item.image as ImageSourcePropType} />
      <View style={[ds.px10, ds.py6]}>
        <Text fontWeight="Bold" style={[ds.text14]}>
          {item.name}
        </Text>
        <Text style={[ds.text14]}>{item.location}</Text>
      </View>
    </Pressable>
  );
};

export default TourItem;
