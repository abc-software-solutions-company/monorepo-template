import React, { createContext, useContext, useState } from 'react';
import { Pressable, StyleProp, ViewStyle } from 'react-native';
import { Colors, ds } from '@repo/react-native-design-system';
import { dynamicStyles } from '@repo/react-native-design-system/utils/style.util';

import Text from './text';
import View from './view';

type RadioGroupContextType<T> = {
  value: T;
  onValueChange: (value: T) => void;
  activeColor: string;
};

type RadioGroupProps<T> = {
  defaultValue?: T;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onValueChange?: (value: T) => void;
  activeColor?: string;
  direction?: 'vertical' | 'horizontal';
};

type RadioGroupItemProps<T> = {
  value: T;
  label: string;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const RadioGroupContext = createContext<RadioGroupContextType<any> | undefined>(undefined);

export function RadioGroup<T>({
  defaultValue,
  style,
  children,
  onValueChange,
  activeColor = Colors.primary[500],
  direction = 'vertical',
}: RadioGroupProps<T>) {
  const [value, setValue] = useState<T | undefined>(defaultValue);

  const handleValueChange = (newValue: T) => {
    setValue(newValue);
    onValueChange?.(newValue);
  };

  return (
    <RadioGroupContext.Provider value={{ value, onValueChange: handleValueChange, activeColor }}>
      <View style={[style, direction === 'vertical' ? ds.column : ds.row]}>{children}</View>
    </RadioGroupContext.Provider>
  );
}

export function RadioGroupItem<T>({ value, label, style, disabled = false }: RadioGroupItemProps<T>) {
  const context = useContext(RadioGroupContext);

  if (!context) {
    throw new Error('RadioGroupItem must be used within a RadioGroup');
  }

  const { value: selectedValue, onValueChange, activeColor } = context;
  const isSelected = value === selectedValue;

  const handlePress = () => {
    if (!disabled) {
      onValueChange(value);
    }
  };

  return (
    <Pressable
      style={[ds.row, ds.itemsCenter, ds.my4, disabled && ds.opacity50]}
      disabled={disabled}
      accessibilityRole="radio"
      accessibilityState={{ checked: isSelected, disabled }}
      onPress={handlePress}
    >
      <View
        style={[
          ds.border2,
          ds.roundedFull,
          ds.itemsCenter,
          ds.justifyCenter,
          ds.borderPrimary500,
          dynamicStyles.size(20),
          dynamicStyles.border(activeColor),
          disabled && ds.opacity50,
          style,
        ]}
      >
        {isSelected && <View style={[ds.roundedFull, dynamicStyles.size(10), dynamicStyles.background(activeColor)]} />}
      </View>
      <Text style={[ds.ml10, disabled && ds.opacity50]}>{label}</Text>
    </Pressable>
  );
}
