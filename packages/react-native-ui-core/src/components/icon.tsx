import React from 'react';
import { icons } from 'lucide-react-native';
import { ViewStyle } from 'react-native';

import { useCoreUITheme } from '../themes/theme.context';

type IconProps = {
  name: keyof typeof icons;
  color?: string;
  size?: number;
  style?: ViewStyle;
};

const Icon: React.FC<IconProps> = ({ name, color, style, size = 24 }) => {
  const { configs } = useCoreUITheme();

  const LucideIcon = icons[name];

  return <LucideIcon color={color ?? configs.foreground} size={size} style={style} />;
};

export default Icon;
