import React, { FC } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { ds } from '@repo/react-native-design-system';
import { createStyle } from '@repo/react-native-design-system/utils/style.util';
import View from '@repo/react-native-ui-core/components/view';
import { useCoreUITheme } from '@repo/react-native-ui-core/themes/theme.context';

import { ProfileAction } from '../interfaces/profile.interface';

import ProfileActionItem from './profile-action-item';

type ProfileActionListProps = {
  items: ProfileAction[];
  style?: StyleProp<ViewStyle>;
};

const ProfileActionList: FC<ProfileActionListProps> = ({ items, style }) => {
  const { configs } = useCoreUITheme();

  return (
    <View style={[ds.px14, style]}>
      {items?.map(item => <ProfileActionItem key={item.name} item={item} style={[ds.borderB1, styles.border(configs.border)]} />)}
    </View>
  );
};

export default ProfileActionList;

const styles = createStyle({
  border: (color: string): ViewStyle => {
    return {
      borderColor: color,
    };
  },
});
