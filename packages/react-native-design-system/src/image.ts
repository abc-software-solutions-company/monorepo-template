import { ImageProps } from 'react-native';

import { createStyleProp } from './utils/style.util';

const RESIZE_MODE_VALUE: Record<Required<ImageProps>['resizeMode'], Required<ImageProps>['resizeMode']> = {
  cover: 'cover',
  center: 'center',
  contain: 'contain',
  repeat: 'repeat',
  stretch: 'stretch',
};

export const IMAGE_STYLE = { ...createStyleProp(RESIZE_MODE_VALUE, 'resizeMode', value => ({ resizeMode: value })) };
