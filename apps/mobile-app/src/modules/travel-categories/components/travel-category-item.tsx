import React, { FC } from 'react';
import { Pressable } from 'react-native';
import Text from '@repo/react-native-ui-core/components/text';

type TravelCategoryItemProps = {
  onPress?: () => void;
};

const TravelCategoryItem: FC<TravelCategoryItemProps> = ({ onPress }) => {
  return (
    <Pressable onPress={onPress}>
      <Text>Text</Text>
    </Pressable>
  );
};

export default TravelCategoryItem;
