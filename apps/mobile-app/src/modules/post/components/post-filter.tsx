import React, { FC } from 'react';
import Input from '@repo/react-native-ui-core/components/input';
import Text from '@repo/react-native-ui-core/components/text';
import View from '@repo/react-native-ui-core/components/view';

interface IPostFilterProps {
  value?: string;
  onTextChange?: (text: string) => void;
}

const PostFilters: FC<IPostFilterProps> = ({ value, onTextChange, ...rest }) => {
  return (
    <View {...rest}>
      <Text>Search</Text>
      <Input value={value} onChangeText={onTextChange} />
    </View>
  );
};

export default PostFilters;
