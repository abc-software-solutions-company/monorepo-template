import React, { FC } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Button from '@repo/react-native-ui-core/components/button';
import View from '@repo/react-native-ui-core/components/view';

import { TourDetailScreenParams } from '@/modules/navigation/interfaces/navigation.interface';

type TourDetailFooterProps = {
  routeParams: TourDetailScreenParams;
  style?: StyleProp<ViewStyle>;
};

const TourDetailFooter: FC<TourDetailFooterProps> = ({ style }) => {
  return (
    <View style={style}>
      <Button size="lg">Booking Now</Button>
    </View>
  );
};

export default TourDetailFooter;
