import React, { FC } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { ds } from '@repo/react-native-design-system';
import InputText from '@repo/react-native-ui-core/components/input';
import View from '@repo/react-native-ui-core/components/view';

type SearchBoxProps = {
  value: string;
  onChange?: (value: string) => void;
  style?: StyleProp<ViewStyle>;
};

const SearchBox: FC<SearchBoxProps> = ({ value, style, onChange }) => {
  return (
    <View style={ds.row}>
      <InputText value={value} style={[ds.grow, ds.bgWhite, ds.pr56, style]} placeholder="Search..." onChangeText={onChange} />
    </View>
  );
};

export default SearchBox;
