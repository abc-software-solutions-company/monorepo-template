import React, { FC, ReactNode } from 'react';
import { Pressable } from 'react-native';
import FastImage from 'react-native-fast-image';
import { ds } from '@repo/react-native-design-system';
import { dynamicStyles } from '@repo/react-native-design-system/utils/style.util';
import Heading from '@repo/react-native-ui-core/components/heading';
import Text from '@repo/react-native-ui-core/components/text';
import View from '@repo/react-native-ui-core/components/view';
import { useCoreUITheme } from '@repo/react-native-ui-core/themes/theme.context';

type NavigationHeaderProps = {
  title?: string;
  titleColor?: string;
  subTitle?: string;
  subTitleColor?: string;
  borderColor?: string;
  backgroundColor?: string;
  backgroundImage?: string;
  leftComponent?: ReactNode;
  rightComponent?: ReactNode;
  leftFunc?: () => void;
  rightFunc?: () => void;
};

const NavigationHeader: FC<NavigationHeaderProps> = ({
  title = '',
  titleColor,
  subTitle = '',
  subTitleColor,
  borderColor,
  backgroundColor,
  backgroundImage = '',
  leftComponent = null,
  rightComponent = null,
  leftFunc,
  rightFunc,
}) => {
  const { configs } = useCoreUITheme();

  const foregroundColor = configs.foreground;

  return (
    <View style={[ds.borderB1, dynamicStyles.border(borderColor ?? configs.border), dynamicStyles.background(backgroundColor ?? configs.background)]}>
      <View style={[ds.row, ds.justifyBetween, ds.itemsCenter, ds.px8]}>
        <Pressable style={[ds.h32, ds.textCenter, ds.row, ds.gap6, ds.itemsCenter, ds.justifyCenter]} onPress={leftFunc}>
          {leftComponent}
        </Pressable>
        <View style={[ds.column, ds.itemsCenter, ds.justifyCenter, ds.grow, ds.h56]}>
          {backgroundImage && <FastImage source={{ uri: backgroundImage }} />}
          {title && <Heading text={title} as={'h5'} color={titleColor ? titleColor : foregroundColor} />}
          {subTitle && <Text text={subTitle} color={subTitleColor ? subTitleColor : foregroundColor} />}
        </View>
        <Pressable style={[ds.h32, ds.textCenter, ds.row, ds.gap6, ds.itemsCenter, ds.justifyCenter]} onPress={rightFunc}>
          {rightComponent}
        </Pressable>
      </View>
    </View>
  );
};

export default NavigationHeader;
