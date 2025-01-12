import { createStyleProp, getNegativeStyleProp } from './utils/style.util';
import { spacing, spacingPercent } from './config';

const spacingNegative = getNegativeStyleProp(spacing);

const SIZE_VALUE = {
  ...spacing,
  ...spacingNegative,
  ...spacingPercent,
  auto: 'auto',
  full: '100%',
};

export const SIZE_STYLE = {
  ...createStyleProp(SIZE_VALUE, 'w', value => ({ width: value })),
  ...createStyleProp(SIZE_VALUE, 'h', value => ({ height: value })),
  ...createStyleProp(SIZE_VALUE, 'minW', value => ({ minWidth: value })),
  ...createStyleProp(SIZE_VALUE, 'maxW', value => ({ maxWidth: value })),
  ...createStyleProp(SIZE_VALUE, 'minH', value => ({ minHeight: value })),
  ...createStyleProp(SIZE_VALUE, 'maxH', value => ({ maxHeight: value })),
};
