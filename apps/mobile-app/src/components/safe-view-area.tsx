import React, { FC, ReactNode } from 'react';
import { ViewProps, ViewStyle } from 'react-native';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ds } from '@repo/react-native-design-system';
import { createStyle } from '@repo/react-native-design-system/utils/style.util';
import View from '@repo/react-native-ui-core/components/view';

interface ISafeViewAreaProps extends ViewProps {
  children: ReactNode;
  spacingTop?: boolean;
  spacingRight?: boolean;
  spacingBottom?: boolean;
  spacingLeft?: boolean;
}

const SafeViewArea: FC<ISafeViewAreaProps> = ({ children, spacingTop, spacingRight, spacingBottom, spacingLeft, style, ...rest }) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        ds.flex1,
        spacingTop && styles.spacingTop(insets),
        spacingRight && styles.spacingRight(insets),
        spacingBottom && styles.spacingBottom(insets),
        spacingLeft && styles.spacingLeft(insets),
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
};

export default SafeViewArea;

const styles = createStyle({
  spacingTop: (insets: EdgeInsets): ViewStyle => {
    return { paddingTop: insets.top };
  },
  spacingRight: (insets: EdgeInsets): ViewStyle => {
    return { paddingRight: insets.right };
  },
  spacingBottom: (insets: EdgeInsets): ViewStyle => {
    return { paddingBottom: insets.bottom };
  },
  spacingLeft: (insets: EdgeInsets): ViewStyle => {
    return { paddingLeft: insets.left };
  },
});
