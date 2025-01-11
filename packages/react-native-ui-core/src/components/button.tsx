import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import { Pressable, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { Colors, ds } from '@repo/react-native-design-system';

import { ComponentRoundedVariant, ComponentSizeVariant, getComponentSizes, getComponentStyle, getTextStyle } from '../interfaces/input.interface';

import Loading from './loading';
import Text from './text';

import { useCoreUITheme } from '../themes/theme.context';

type ButtonVariant = 'default' | 'outlined' | 'danger';

interface IButtonProps extends React.ComponentPropsWithoutRef<typeof Pressable> {
  children?: ReactNode;
  size?: ComponentSizeVariant;
  rounded?: ComponentRoundedVariant;
  variant?: ButtonVariant;
  submittingText?: string;
  submittedText?: string;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  onPress?: () => Promise<void> | void;
}

const Button: React.FC<IButtonProps> = ({
  children,
  size = 'md',
  rounded = 'full',
  variant = 'default',
  submittingText,
  submittedText,
  loading = false,
  disabled = false,
  style,
  textStyle,
  onPress,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(loading);
  const [isSaved, setIsSaved] = useState(false);
  const { theme, configs } = useCoreUITheme();

  const isDisabled = disabled || isLoading || isSaved;

  const defaultTheme = {
    bgColor: configs.primary[500],
    focusedBgColor: configs.primary[600],
    focusTextColor: Colors.white,
    textColor: Colors.white,
    borderColor: 'transparent',
  };
  const outlineTheme = {
    bgColor: 'transparent',
    focusedBgColor: configs.primary[600],
    focusTextColor: Colors.white,
    textColor: configs.primary[500],
    borderColor: configs.primary[500],
  };
  const dangerTheme = {
    bgColor: configs.destructive,
    focusedBgColor: Colors.red[700],
    focusTextColor: configs.destructiveForeground,
    textColor: Colors.white,
    borderColor: 'transparent',
  };

  const buttonVariants = {
    system: { default: defaultTheme, outlined: outlineTheme, danger: dangerTheme },
    light: { default: defaultTheme, outlined: outlineTheme, danger: dangerTheme },
    dark: { default: defaultTheme, outlined: outlineTheme, danger: dangerTheme },
  };

  const { bgColor, textColor, focusedBgColor, focusTextColor, borderColor } = buttonVariants[theme as keyof typeof buttonVariants][variant];

  const buttonStyle: ViewStyle = {
    ...getComponentStyle(size, rounded, 'button'),
    backgroundColor: isFocused ? focusedBgColor : bgColor,
    borderColor: borderColor,
    borderWidth: variant === 'outlined' ? 1 : 0,
  };

  const buttonTextStyle: TextStyle = {
    ...getTextStyle(size, 'button'),
    color: isFocused ? focusTextColor : textColor,
  };

  const getButtonText = useMemo(() => {
    return () => {
      if (isLoading && submittingText) return submittingText;
      if (isSaved && submittedText) return submittedText;

      return children;
    };
  }, [isLoading, submittingText, isSaved, submittedText, children]);

  const handlePress = async () => {
    if (onPress && !isDisabled) {
      setIsLoading(true);
      try {
        await onPress();
        setIsSaved(true);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);

  useEffect(() => {
    if (isSaved) {
      const timer = setTimeout(() => setIsSaved(false), 1000);

      return () => clearTimeout(timer);
    }
  }, [isSaved]);

  return (
    <Pressable
      {...rest}
      style={[ds.itemsCenter, ds.justifyCenter, ds.row, ds.gap10, buttonStyle, isDisabled && ds.opacity50, style]}
      disabled={isDisabled}
      onPress={handlePress}
      onPressIn={() => setIsFocused(true)}
      onPressOut={() => setIsFocused(false)}
    >
      {isLoading && <Loading size={getComponentSizes('button')[size].iconSize} color="white" trackColor={Colors.gray[300]} />}
      <Text testID={`${rest.testID}.label`} fontWeight="Bold" style={[ds.uppercase, buttonTextStyle, textStyle]}>
        {getButtonText()}
      </Text>
    </Pressable>
  );
};

export default Button;
