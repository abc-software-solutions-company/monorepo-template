import React, { FC } from 'react';
import { Appearance, StatusBar as RNStatusBar, StatusBarStyle, StyleProp, ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@repo/react-native-design-system';
import { dynamicStyles } from '@repo/react-native-design-system/utils/style.util';

import View from './view';

import { useCoreUITheme } from '../themes/theme.context';

interface IStatusBarProps {
  background?: string;
  color?: 'dark-content' | 'light-content' | 'default';
  style?: StyleProp<ViewProps>;
  visible?: boolean;
}

const StatusBar: FC<IStatusBarProps> = ({ style, background, visible = true }) => {
  const insets = useSafeAreaInsets();
  const { theme, configs } = useCoreUITheme();

  let textColor: StatusBarStyle = theme === 'dark' ? 'light-content' : 'dark-content';

  switch (theme) {
    case 'dark':
      textColor = 'light-content';
      break;
    case 'light':
      textColor = 'dark-content';
      break;
    default:
      textColor = Appearance.getColorScheme() === 'dark' ? 'light-content' : 'dark-content';
      break;
  }

  return (
    <>
      <RNStatusBar barStyle={textColor} hidden={!visible} translucent={true} backgroundColor={Colors.transparent} />
      {visible && <View style={[{ height: insets.top }, dynamicStyles.background(background ?? configs.background), style]} />}
    </>
  );
};

export default StatusBar;
