/*
 * @Author: <Tin Tran> (tin.tran@abcdigital.io)
 * @Created: 2024-09-21 14:18:35
 */

import React, { useState } from 'react';
import { Animated, Pressable, StyleProp, ViewStyle } from 'react-native';
import { Colors, ds } from '@repo/react-native-design-system';
import { dynamicStyles } from '@repo/react-native-design-system/utils/style.util';

type SwitcherProps = {
  checked?: boolean;
  activeColor?: string;
  inactiveColor?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  onValueChange?: (value: boolean) => void;
};

const Switcher: React.FC<SwitcherProps> = ({
  checked = false,
  activeColor = Colors.primary[500],
  inactiveColor = Colors.gray[300],
  disabled = false,
  style,
  onValueChange,
}) => {
  const [isOn, setIsOn] = useState(checked);
  const [animation] = useState(new Animated.Value(isOn ? 1 : 0));

  const toggleSwitch = () => {
    if (disabled) return;

    const isCheck = !isOn;

    setIsOn(isCheck);
    onValueChange?.(isCheck);

    Animated.timing(animation, {
      toValue: isCheck ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const backgroundColorInterpolation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [inactiveColor, activeColor],
  });

  const translateXInterpolation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 20],
  });

  return (
    <Pressable style={[ds.row, ds.itemsCenter, disabled && ds.opacity50]} disabled={disabled} onPress={toggleSwitch}>
      <Animated.View style={[ds.rounded16, ds.w44, ds.h24, { backgroundColor: backgroundColorInterpolation }, disabled && ds.opacity50, style]}>
        <Animated.View
          style={[ds.absolute, ds.rounded12, dynamicStyles.size(20), ds.bgWhite, ds.m2, { transform: [{ translateX: translateXInterpolation }] }]}
        />
      </Animated.View>
    </Pressable>
  );
};

export default Switcher;
