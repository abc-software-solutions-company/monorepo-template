import React from 'react';
import { CheckIcon } from 'lucide-react-native';
import { Pressable } from 'react-native';
import { ds } from '@repo/react-native-design-system';
import { dynamicStyles } from '@repo/react-native-design-system/utils/style.util';
import Text from '@repo/react-native-ui-core/components/text';
import { Theme } from '@repo/react-native-ui-core/interfaces/theme.interface';
import { useCoreUITheme } from '@repo/react-native-ui-core/themes/theme.context';

import { ThemeNames } from '../constants/theme.constant';

type ThemeItemProps = {
  theme: string;
  onSelectTheme: (theme: string) => void;
};
const ThemeItem: React.FC<ThemeItemProps> = ({ theme, onSelectTheme }) => {
  const { theme: activeTheme, configs } = useCoreUITheme();

  return (
    <Pressable
      style={[
        ds.row,
        ds.itemsCenter,
        ds.justifyBetween,
        ds.h56,
        ds.px14,
        ds.border1,
        ds.rounded12,
        dynamicStyles.background(configs.card),
        dynamicStyles.border(configs.border),
      ]}
      onPress={() => onSelectTheme(theme)}
    >
      <Text fontWeight="Bold">{ThemeNames[theme as Theme]}</Text>
      {theme === activeTheme && <CheckIcon size={24} color={configs.primary[500]} strokeWidth={2} />}
    </Pressable>
  );
};

export default ThemeItem;
