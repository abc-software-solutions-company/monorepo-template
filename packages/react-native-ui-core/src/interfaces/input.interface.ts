import { TextStyle, ViewStyle } from 'react-native';
import { calculateLineHeight } from '@repo/react-native-design-system/utils/font.util';

export type ComponentSizeVariant = 'sm' | 'md' | 'lg';
export type ComponentRoundedVariant = 'none' | 'sm' | 'md' | 'lg' | 'full';

export const getComponentSizes = (_type: 'button' | 'input') => ({
  sm: { height: 42, paddingHorizontal: 12, fontSize: 16, iconSize: 20 },
  md: { height: 48, paddingHorizontal: 20, fontSize: 18, iconSize: 22 },
  lg: { height: 52, paddingHorizontal: 28, fontSize: 20, iconSize: 24 },
});

export const componentRoundedVariants: Record<ComponentRoundedVariant, { borderRadius: number }> = {
  none: { borderRadius: 0 },
  sm: { borderRadius: 4 },
  md: { borderRadius: 8 },
  lg: { borderRadius: 12 },
  full: { borderRadius: 9999 },
};

export const getComponentStyle = (size: ComponentSizeVariant, rounded: ComponentRoundedVariant, type: 'button' | 'input'): ViewStyle => {
  const { height, paddingHorizontal } = getComponentSizes(type)[size];
  const { borderRadius } = componentRoundedVariants[rounded];

  return {
    height,
    paddingHorizontal,
    borderRadius,
  };
};

export const getTextStyle = (size: ComponentSizeVariant, type: 'button' | 'input'): TextStyle => {
  const { fontSize } = getComponentSizes(type)[size];

  return {
    fontSize,
    lineHeight: calculateLineHeight(fontSize),
  };
};
