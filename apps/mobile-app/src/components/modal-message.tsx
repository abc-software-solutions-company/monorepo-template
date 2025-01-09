import React, { FC } from 'react';
import { ds } from '~react-native-design-system';
import Button from '~react-native-ui-core/components/button';
import Heading from '~react-native-ui-core/components/heading';
import Text from '~react-native-ui-core/components/text';
import View from '~react-native-ui-core/components/view';

interface IMessageBoxProps {
  title?: string | null;
  message?: string | null;
  btnClose?: string | null;
  onClose: () => void;
}

const ModalMessage: FC<IMessageBoxProps> = ({ title = '', message = '', btnClose = 'Close', onClose }) => {
  return (
    <View>
      <Heading>{title}</Heading>
      <View style={[ds.pt8]}>
        <Text>{message}</Text>
      </View>
      <View>
        <Button style={[ds.wFull]} onPress={onClose}>
          {btnClose}
        </Button>
      </View>
    </View>
  );
};

export default ModalMessage;
