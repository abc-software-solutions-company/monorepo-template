import React, { FC } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Button from '~react-native-ui-core/components/button';
import View from '~react-native-ui-core/components/view';

import { TravelPlaceDetailScreenParams } from '@/modules/navigation/interfaces/navigation.interface';

type TravelPlaceDetailFooterProps = {
  routeParams: TravelPlaceDetailScreenParams;
  style?: StyleProp<ViewStyle>;
};

const TravelPlaceDetailFooter: FC<TravelPlaceDetailFooterProps> = ({ style }) => {
  return (
    <View style={style}>
      <Button size="lg">Booking Now</Button>
    </View>
  );
};

export default TravelPlaceDetailFooter;
