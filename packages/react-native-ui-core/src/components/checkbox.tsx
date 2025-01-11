import React, { useState } from 'react';
import { Pressable, StyleProp, ViewStyle } from 'react-native';
import { Colors, ds } from '@repo/react-native-design-system';
import { dynamicStyles } from '@repo/react-native-design-system/utils/style.util';

import Icon from './icon';
import Text from './text';
import View from './view';

type CheckboxProps = {
  label: string;
  checked?: boolean;
  activeColor?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  onValueChange?: (isChecked: boolean) => void;
};

const Checkbox: React.FC<CheckboxProps> = ({ label, activeColor = Colors.primary[500], checked = false, disabled = false, style, onValueChange }) => {
  const [isChecked, setIsChecked] = useState(checked);

  const toggleCheckbox = () => {
    setIsChecked(!isChecked);
    onValueChange?.(!isChecked);
  };

  return (
    <Pressable style={[ds.row, ds.itemsCenter, disabled && ds.opacity50]} disabled={disabled} onPress={toggleCheckbox}>
      <View
        style={[
          ds.border2,
          ds.rounded4,
          ds.itemsCenter,
          ds.justifyCenter,
          ds.borderPrimary500,
          dynamicStyles.size(20),
          dynamicStyles.border(activeColor),
          disabled && ds.opacity50,
          style,
        ]}
      >
        {isChecked && <Icon name="Check" size={16} color={activeColor} />}
      </View>
      <Text style={[ds.ml10, disabled && ds.opacity50]}>{label}</Text>
    </Pressable>
  );
};

export default Checkbox;
