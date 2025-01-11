import React, { FC } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Heading from '@repo/react-native-ui-core/components/heading';
import Text from '@repo/react-native-ui-core/components/text';
import View from '@repo/react-native-ui-core/components/view';

import { AccommodationDetailScreenParams } from '@/modules/navigation/interfaces/navigation.interface';

type AccommodationDetailHeaderProps = {
  routeParams: AccommodationDetailScreenParams;
  style?: StyleProp<ViewStyle>;
};

const AccommodationDetailHeader: FC<AccommodationDetailHeaderProps> = ({ style }) => {
  return (
    <View style={style}>
      <View>
        <Heading>Taj Mahal</Heading>
      </View>
      <View>
        <View>
          <Text>Rating</Text>
          <Text>4.8</Text>
          <Text>(120 reviewers)</Text>
        </View>
        <View>
          <Text>Price</Text>
          <Text>250$</Text>
          <Text>/night</Text>
        </View>
      </View>
    </View>
  );
};

export default AccommodationDetailHeader;
