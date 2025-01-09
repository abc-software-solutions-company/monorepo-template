import React, { FC, ReactNode } from 'react';
import { View as RNView, ViewProps } from 'react-native';

import { ICoreUIBaseProps } from '../interfaces/component.interface';

interface IViewProps extends ViewProps, ICoreUIBaseProps {
  children?: ReactNode;
}

const View: FC<IViewProps> = ({ children, visible = true, style, ...rest }) => {
  if (!visible) return null;

  return (
    <RNView style={style} {...rest}>
      {children}
    </RNView>
  );
};

export default View;
