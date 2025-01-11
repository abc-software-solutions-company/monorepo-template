import React, { FC } from 'react';
import { ChevronRight } from 'lucide-react-native';
import { Pressable, StyleProp, ViewStyle } from 'react-native';
import { ds } from '@repo/react-native-design-system';
import Text from '@repo/react-native-ui-core/components/text';
import View from '@repo/react-native-ui-core/components/view';
import { useCoreUITheme } from '@repo/react-native-ui-core/themes/theme.context';

import { ProfileAction } from '../interfaces/profile.interface';

type ProfileActionItemProps = {
  item: ProfileAction;
  style?: StyleProp<ViewStyle>;
};

const ProfileActionItem: FC<ProfileActionItemProps> = ({ item, style }) => {
  const { configs } = useCoreUITheme();

  return (
    <>
      <Pressable style={[ds.py14, ds.row, ds.itemsCenter, ds.justifyBetween, style]} onPress={item.action}>
        <View style={[ds.row, ds.itemsCenter, ds.gap10]}>
          {item.icon}
          <Text fontWeight="Bold">{item.name}</Text>
        </View>
        <View style={[ds.row, ds.itemsCenter, ds.gap6]}>
          {typeof item.value === 'string' && <Text>{item.value}</Text>}
          {item.type === 'sub' && <ChevronRight color={configs.primary[500]} />}
        </View>
      </Pressable>
    </>
  );
};

export default ProfileActionItem;
