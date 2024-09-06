import React, { FC } from 'react';
import { SearchIcon } from 'lucide-react-native';
import { Pressable } from 'react-native';
import { ds } from '~react-native-design-system';
import InputText from '~react-native-ui-core/components/input';
import View from '~react-native-ui-core/components/view';

type SearchBoxProps = {
  value: string;
  onChange?: (value: string) => void;
};

const SearchBox: FC<SearchBoxProps> = ({ value, onChange }) => {
  return (
    <View style={ds.row}>
      <InputText value={value} style={[ds.grow, ds.bgWhite, ds.pr56]} onChangeText={onChange} />
      <Pressable style={[ds.absolute, ds.right0, ds.roundedR12, ds.px10, ds.h44, ds.mt2, ds.justifyCenter]}>
        <SearchIcon />
      </Pressable>
    </View>
  );
};

export default SearchBox;
