import React from 'react';
import { icons } from 'lucide-react-native';

import { useCoreUITheme } from '../themes/theme.context';

type IconProps = {
  name: keyof typeof icons;
  color?: string;
  size?: number;
};

const Icon: React.FC<IconProps> = ({ name, color, size = 24 }) => {
  const { configs } = useCoreUITheme();

  const LucideIcon = icons[name];

  return <LucideIcon color={color ?? configs.foreground} size={size} />;
};

export default Icon;
