import React, { FC } from 'react';
import { ds } from '@repo/react-native-design-system';
import Text from '@repo/react-native-ui-core/components/text';
import View from '@repo/react-native-ui-core/components/view';
import { useCoreUITheme } from '@repo/react-native-ui-core/themes/theme.context';

import { PostEntity } from '../interfaces/post.interface';

interface IPostItemProps {
  item: PostEntity;
}

export const PostItem: FC<IPostItemProps> = ({ item }) => {
  const { configs } = useCoreUITheme();

  return (
    <View style={[ds.p10, ds.borderB1, ds.borderRed500]}>
      <View>
        <Text color={configs.foreground} fontWeight="Bold">
          {item.name}
        </Text>
      </View>
      <Text color={configs.foreground}>{item.description}</Text>
    </View>
  );
};
