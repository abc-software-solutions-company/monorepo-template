import React, { FC, forwardRef, useCallback, useEffect, useState } from 'react';
import { NativeSyntheticEvent, TextInput, TextInputChangeEventData, TextStyle, ViewStyle } from 'react-native';
import { Colors } from '@repo/react-native-design-system';
import { dynamicStyles } from '@repo/react-native-design-system/utils/style.util';

import { ComponentRoundedVariant, ComponentSizeVariant, getComponentStyle, getTextStyle } from '../interfaces/input.interface';

import { useCoreUITheme } from '../themes/theme.context';

export interface IInputTextProps extends React.ComponentPropsWithRef<typeof TextInput> {
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  multiline?: boolean;
  secureTextEntry?: boolean;
  size?: ComponentSizeVariant;
  rounded?: ComponentRoundedVariant;
  error?: boolean;
  onChange?: (e: NativeSyntheticEvent<TextInputChangeEventData>) => void;
  onChangeText?: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

const InputText: FC<IInputTextProps> = forwardRef<TextInput, IInputTextProps>(
  (
    {
      value,
      defaultValue,
      placeholder,
      keyboardType,
      secureTextEntry,
      multiline = false,
      size = 'md',
      rounded = 'full',
      error = false,
      style,
      onChange,
      onChangeText,
      onFocus,
      onBlur,
      ...restProps
    },
    ref
  ) => {
    const [val, setVal] = useState(value ?? defaultValue ?? '');
    const [isFocused, setIsFocused] = useState(false);
    const { configs } = useCoreUITheme();

    const inputStyle: ViewStyle | TextStyle = {
      ...getComponentStyle(size, rounded, 'input'),
      ...getTextStyle(size, 'input'),
      lineHeight: undefined,
      borderWidth: 1,
      borderColor: error ? Colors.red[500] : isFocused ? configs.primary[500] : configs.border,
    };

    const handleChange = useCallback(
      (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
        const text = event.nativeEvent.text;

        onChange?.(event);
        setVal(text);
      },
      [onChange]
    );

    const handleChangeText = useCallback(
      (text: string) => {
        onChangeText?.(text);
        setVal(text);
      },
      [onChangeText]
    );

    const handleFocus = useCallback(() => {
      setIsFocused(true);
      onFocus?.();
    }, [onFocus]);

    const handleBlur = useCallback(() => {
      setIsFocused(false);
      onBlur?.();
    }, [onBlur]);

    useEffect(() => {
      if (value !== undefined) {
        setVal(value);
      }
    }, [value]);

    return (
      <TextInput
        ref={ref}
        value={val}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        multiline={multiline}
        placeholderTextColor={Colors.stone[400]}
        style={[dynamicStyles.color(configs.foreground), dynamicStyles.background(configs.card), inputStyle, style]}
        onChange={handleChange}
        onChangeText={handleChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...restProps}
      />
    );
  }
);

export default InputText;
