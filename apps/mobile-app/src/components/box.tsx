import React, { FC, ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { ds } from '~react-native-design-system';
import { dynamicStyles } from '~react-native-design-system/utils/style.util';
import View from '~react-native-ui-core/components/view';
import { useCoreUITheme } from '~react-native-ui-core/themes/theme.context';

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
  hasBg = true,
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
