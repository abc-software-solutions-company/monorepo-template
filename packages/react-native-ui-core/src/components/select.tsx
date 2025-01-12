import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, TextStyle, ViewStyle } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Colors, ds } from '@repo/react-native-design-system';
import { dynamicStyles } from '@repo/react-native-design-system/utils/style.util';

import { ComponentRoundedVariant, ComponentSizeVariant, getComponentStyle, getTextStyle } from '../interfaces/input.interface';

import { BottomSheet, BottomSheetRef } from './bottom-sheet';
import Heading from './heading';
import Icon from './icon';
import InputText from './input';
import { Portal } from './portal';
import Separator from './separator';
import Text from './text';

import { useCoreUITheme } from '../themes/theme.context';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SelectItem = Record<string, any>;

type SelectItemProps = {
  item: SelectItem;
  isSelected: boolean;
  onPress: (item: SelectItem) => void;
  getItemDisplay: (item: SelectItem) => string;
  isFirst: boolean;
  isLast: boolean;
};

const SelectItem: FC<SelectItemProps> = ({ item, isSelected, onPress, getItemDisplay, isFirst, isLast }) => {
  return (
    <>
      <Pressable
        style={[ds.px12, ds.py8, ds.row, ds.justifyBetween, ds.itemsCenter, isFirst && ds.mt1, isLast && ds.mb1]}
        onPress={() => onPress(item)}
      >
        <Text fontWeight={isSelected ? 'Bold' : 'Regular'}>{getItemDisplay(item)}</Text>
        {isSelected && <Icon name="Check" color={Colors.primary[500]} size={20} />}
      </Pressable>
      {!isLast && <Separator />}
    </>
  );
};

type SelectProps = {
  items: SelectItem[];
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  size?: ComponentSizeVariant;
  rounded?: ComponentRoundedVariant;
  error?: boolean;
  disabled?: boolean;

  valueField?: string;
  displayField?: string;
  showSearch?: boolean;
  onValueChange?: (item: SelectItem) => void;
  onFocus?: () => void;
  onBlur?: () => void;
};

const Select: FC<SelectProps> = ({
  items,
  placeholder = '',
  value,
  defaultValue,
  size = 'md',
  rounded = 'full',
  disabled = false,
  error,

  valueField = 'id',
  displayField = 'label',
  showSearch = false,
  onFocus,
  onBlur,
  onValueChange,
}) => {
  const [selectedItem, setSelectedItem] = useState<SelectItem | null>(null);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const bottomSheetRef = useRef<BottomSheetRef>(null);
  const [isFocused, setIsFocused] = useState(false);
  const { configs } = useCoreUITheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);

  const inputStyle: ViewStyle | TextStyle = {
    ...getComponentStyle(size, rounded, 'input'),
    ...getTextStyle(size, 'input'),
    borderWidth: 1,
    borderColor: error ? Colors.red[500] : isFocused ? configs.primary[500] : configs.border,
  };

  const getItemValue = (item: SelectItem) => item[valueField];
  const getItemDisplay = (item: SelectItem) => item[displayField];

  useEffect(() => {
    const findAndSetItem = (searchValue: string | undefined) => {
      if (searchValue !== undefined) {
        const foundItem = items.find(item => getItemValue(item) === searchValue || getItemDisplay(item) === searchValue);

        if (foundItem) {
          setSelectedItem(foundItem);

          return true;
        }
      }

      return false;
    };

    if (!findAndSetItem(value)) {
      findAndSetItem(defaultValue);
    }
  }, [value, defaultValue, items, valueField, displayField]);

  useEffect(() => {
    if (showSearch) {
      const filtered = items.filter(item => getItemDisplay(item).toLowerCase().includes(searchQuery.toLowerCase()));

      setFilteredItems(filtered);
    } else {
      setFilteredItems(items);
    }
  }, [searchQuery, items, showSearch]);

  const handlePresentModalPress = useCallback(() => {
    if (!disabled) {
      bottomSheetRef.current?.present();
      setIsBottomSheetVisible(true);
      handleFocus();
    }
  }, [disabled]);

  const handleItemPress = useCallback(
    (item: SelectItem) => {
      setSelectedItem(item);
      onValueChange?.(item);
      bottomSheetRef.current?.dismiss();
      setIsBottomSheetVisible(false);
      handleBlur();
    },
    [onValueChange]
  );

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const handleBottomSheetDismiss = useCallback(() => {
    setIsBottomSheetVisible(false);
    handleBlur();
    setSearchQuery('');
  }, []);

  const renderItem = useCallback(
    ({ item, index }: { item: SelectItem; index: number }) => {
      const isSelected = selectedItem !== null && getItemValue(selectedItem) === getItemValue(item);
      const isFirst = index === 0;
      const isLast = index === filteredItems.length - 1;

      return (
        <SelectItem item={item} isSelected={isSelected} getItemDisplay={getItemDisplay} isFirst={isFirst} isLast={isLast} onPress={handleItemPress} />
      );
    },
    [handleItemPress, getItemDisplay, selectedItem, getItemValue, filteredItems.length]
  );

  return (
    <>
      <Pressable
        style={[
          ds.row,
          ds.itemsCenter,
          ds.justifyCenter,
          ds.justifyBetween,
          dynamicStyles.color(configs.foreground),
          dynamicStyles.background(configs.card),
          disabled && ds.opacity50,
          inputStyle,
          isFocused && { borderColor: configs.primary[500] },
        ]}
        disabled={disabled}
        onPress={handlePresentModalPress}
      >
        {selectedItem ? (
          <Text style={[disabled && ds.textGray400]}>{getItemDisplay(selectedItem)}</Text>
        ) : (
          <Text style={[ds.textGray400]}>{placeholder}</Text>
        )}
        {<Icon name={isBottomSheetVisible ? 'ChevronUp' : 'ChevronDown'} color={configs.foreground} size={20} />}
      </Pressable>
      <Portal>
        <BottomSheet ref={bottomSheetRef} onDismiss={handleBottomSheetDismiss}>
          <Heading as="h4" text="Select an item" style={[ds.my2, ds.textCenter]} />
          {showSearch && <InputText style={[ds.my6, ds.mx12]} size="sm" placeholder="Search..." value={searchQuery} onChangeText={setSearchQuery} />}
          <FlatList
            data={filteredItems}
            renderItem={renderItem}
            keyExtractor={item => getItemValue(item).toString()}
            keyboardShouldPersistTaps="handled"
          />
        </BottomSheet>
      </Portal>
    </>
  );
};

export default Select;
