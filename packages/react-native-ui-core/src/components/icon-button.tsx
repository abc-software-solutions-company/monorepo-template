/*
 * @Author: <Tin Tran> (tin.tran@abcdigital.io)
 * @Created: 2024-09-18 16:55:20
 */

import React from 'react';
import { icons } from 'lucide-react-native';
import { Pressable, ViewStyle } from 'react-native';
import { ds } from '@repo/react-native-design-system';
import { dynamicStyles } from '@repo/react-native-design-system/utils/style.util';

import Icon from './icon';

import { useCoreUITheme } from '../themes/theme.context';

type IconButtonSize = 'sm' | 'md' | 'lg';

type IconButtonProps = {
  name: keyof typeof icons;
  onPress?: () => void;
  size?: IconButtonSize;
  color?: string;
  disabled?: boolean;
  style?: ViewStyle;
};

const IconButton: React.FC<IconButtonProps> = ({ name, onPress, size = 'md', color, disabled = false, style }) => {
  const { configs } = useCoreUITheme();

  const getIconSize = (): number => {
    switch (size) {
      case 'sm':
        return 20;
      case 'md':
        return 24;
      case 'lg':
        return 28;
      default:
        return 24;
    }
  };

  const getButtonSize = (): number => {
    switch (size) {
      case 'sm':
        return 32;
      case 'md':
        return 40;
      case 'lg':
        return 48;
      default:
        return 40;
    }
  };

  const buttonSize = getButtonSize();

  return (
    <Pressable
      disabled={disabled}
      style={({ pressed }) => [
        ds.justifyCenter,
        ds.itemsCenter,
        dynamicStyles.size(buttonSize),
        dynamicStyles.color(pressed ? configs.primaryForeground : 'transparent'),
        { opacity: disabled ? 0.3 : 1 },
        style,
      ]}
      onPress={onPress}
    >
      <Icon name={name} size={getIconSize()} color={color ?? configs.foreground} />
    </Pressable>
  );
};

export default IconButton;
