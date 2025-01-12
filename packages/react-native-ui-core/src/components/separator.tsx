import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { ds } from '@repo/react-native-design-system';

import View from './view';

import { useCoreUITheme } from '../themes/theme.context';

interface ISeparatorProps {
  orientation?: 'vertical' | 'horizontal';
  style?: StyleProp<ViewStyle>;
}
function Separator({ orientation = 'horizontal', style, ...rest }: ISeparatorProps) {
  const { configs } = useCoreUITheme();

  const bgColor: ViewStyle = { backgroundColor: configs.border };

  return <View style={[orientation === 'horizontal' ? [ds.wFull, { height: 1 }] : [ds.hFull, { width: 1 }], bgColor, style]} {...rest} />;
}

export default Separator;
