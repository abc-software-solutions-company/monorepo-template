import React, { FC } from 'react';
import { Pressable } from 'react-native';
import { ds } from '@repo/react-native-design-system';

import { ICoreUIBaseProps } from '../interfaces/component.interface';

interface IBackdropProps extends ICoreUIBaseProps {
  onPress?: () => void;
}

const Backdrop: FC<IBackdropProps> = ({ visible = false, onPress }) => {
  if (!visible) return null;

  return <Pressable style={[ds.absolute, ds.left0, ds.top0, ds.wFull, ds.hFull, ds.bgBlack, ds.opacity40]} onPress={onPress} />;
};

export default Backdrop;
