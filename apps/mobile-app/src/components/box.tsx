import React, { FC, ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { ds } from '@repo/react-native-design-system';
import { dynamicStyles } from '@repo/react-native-design-system/utils/style.util';
import View from '@repo/react-native-ui-core/components/view';
import { useCoreUITheme } from '@repo/react-native-ui-core/themes/theme.context';

type BoxProps = {
  padding?: number;
  hasRounded?: boolean;
  hasBorder?: boolean;
  hasBg?: boolean;
  paddingHorizontal?: boolean;
  paddingVertical?: boolean;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

const Box: FC<BoxProps> = ({
  children,
  hasRounded = true,
  hasBorder = false,
  hasBg = false,
  paddingHorizontal = true,
  paddingVertical = true,
  padding = 12,
  style,
}) => {
  const { configs } = useCoreUITheme();

  return (
    <View
      style={[
        hasRounded && ds.rounded12,
        hasBorder && [ds.border1, dynamicStyles.border(configs.border)],
        hasBg && dynamicStyles.background(configs.card),
        paddingVertical && dynamicStyles.paddingVertical(padding),
        paddingHorizontal && dynamicStyles.paddingHorizontal(padding),
        style,
      ]}
    >
      {children}
    </View>
  );
};

export default Box;
