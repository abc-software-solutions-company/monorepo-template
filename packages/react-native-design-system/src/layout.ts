import { createStyleProp } from './utils/style.util';
import { spacing } from './config';

const DISPLAY_VALUE = {
  hidden: 'none',
  flex: 'flex',
};

const OVERFLOW_VALUE = {
  hidden: 'hidden',
  visible: 'visible',
  scroll: 'scroll',
};

const POSITION_TYPE_VALUE = {
  absolute: 'absolute',
  relative: 'relative',
};

const POSITION_VALUE = {
  0: 0,
  ...spacing,
};

const Z_INDEX_VALUE = {
  0: 0,
  10: 10,
  20: 20,
  30: 30,
  40: 40,
  50: 50,
  '10ne': -10,
  '20ne': -20,
  '30ne': -30,
  '40ne': -40,
  '50ne': -50,
};

export const LAYOUT_STYLE = {
  ...createStyleProp(DISPLAY_VALUE, undefined, value => ({ display: value })),
  ...createStyleProp(OVERFLOW_VALUE, 'overflow', value => ({ overflow: value })),
  ...createStyleProp(POSITION_TYPE_VALUE, undefined, value => ({ position: value })),

  ...createStyleProp(POSITION_VALUE, 'top', value => ({ top: value })),
  ...createStyleProp(POSITION_VALUE, 'right', value => ({ right: value })),
  ...createStyleProp(POSITION_VALUE, 'bottom', value => ({ bottom: value })),
  ...createStyleProp(POSITION_VALUE, 'left', value => ({ left: value })),
  ...createStyleProp(Z_INDEX_VALUE, 'z', value => ({ zIndex: value })),
};
