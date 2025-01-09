import { createStyleProp } from './utils/style.util';

const BORDER_WIDTH_VALUE = {
  '0': 0,
  '1': 1,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  '10': 10,
  '11': 11,
  '12': 12,
};

const BORDER_RADIUS_VALUE = {
  '0': 0,
  '1': 1,
  '2': 2,
  '3': 3,
  '4': 4,
  '6': 6,
  '8': 8,
  '10': 10,
  '12': 12,
  '14': 14,
  '16': 16,
  '20': 20,
  '24': 24,
  full: 9999,
};
const BORDER_STYLE_VALUE = { solid: 'solid', dashed: 'dashed', dotted: 'dotted' };

export const BORDER_STYLE = {
  ...createStyleProp(BORDER_WIDTH_VALUE, 'border', value => ({ borderWidth: value })),
  ...createStyleProp(BORDER_WIDTH_VALUE, 'borderT', value => ({ borderTopWidth: value })),
  ...createStyleProp(BORDER_WIDTH_VALUE, 'borderR', value => ({ borderRightWidth: value })),
  ...createStyleProp(BORDER_WIDTH_VALUE, 'borderB', value => ({ borderBottomWidth: value })),
  ...createStyleProp(BORDER_WIDTH_VALUE, 'borderL', value => ({ borderLeftWidth: value })),
  ...createStyleProp(BORDER_WIDTH_VALUE, 'borderStart', value => ({ borderStartWidth: value })),
  ...createStyleProp(BORDER_WIDTH_VALUE, 'borderEnd', value => ({ borderEndWidth: value })),

  ...createStyleProp(BORDER_RADIUS_VALUE, 'rounded', value => ({ borderRadius: value })),
  ...createStyleProp(BORDER_RADIUS_VALUE, 'roundedT', value => ({ borderTopRightRadius: value, borderTopLeftRadius: value })),
  ...createStyleProp(BORDER_RADIUS_VALUE, 'roundedR', value => ({ borderBottomRightRadius: value, borderTopRightRadius: value })),
  ...createStyleProp(BORDER_RADIUS_VALUE, 'roundedB', value => ({ borderBottomRightRadius: value, borderBottomLeftRadius: value })),
  ...createStyleProp(BORDER_RADIUS_VALUE, 'roundedL', value => ({ borderBottomLeftRadius: value, borderTopLeftRadius: value })),

  ...createStyleProp(BORDER_STYLE_VALUE, 'border', value => ({ borderStyle: value })),
};
