import React, { FC } from 'react';
import { Pressable, StyleProp, ViewStyle } from 'react-native';
import { ds } from '~react-native-design-system';
import Icon from '~react-native-ui-core/components/icon';
import InputText from '~react-native-ui-core/components/input';
import View from '~react-native-ui-core/components/view';

type SearchBoxProps = {
  value: string;
  onChange?: (value: string) => void;
  style?: StyleProp<ViewStyle>;
};

const SearchBox: FC<SearchBoxProps> = ({ value, style, onChange }) => {
  return (
    <View style={ds.row}>
      <InputText value={value} style={[ds.grow, ds.bgWhite, ds.pr48]} onChangeText={onChange} />
      <Pressable style={[ds.absolute, ds.right6, ds.roundedR12, ds.px10, ds.h44, ds.mt2, ds.justifyCenter]}>
        <Icon name="Search" size={20} />
      </Pressable>
    </View>
  );
};

export default SearchBox;
