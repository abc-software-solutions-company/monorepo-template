import { createStyleProp } from './utils/style.util';
import { spacing } from './config';

const FLEX_SPECIFIC_VALUES = {
  flex1: { flexGrow: 1, flexShrink: 1, flexBasis: '0%' },
  flexAuto: { flexGrow: 1, flexShrink: 1, flexBasis: 'auto' },
  flexInitial: { flexGrow: 0, flexShrink: 1, flexBasis: 'auto' },
};

const FLEX_DIRECTION_VALUE = {
  row: 'row',
  column: 'column',
  columnReverse: 'column-reverse',
  rowReverse: 'row-reverse',
};

const FLEX_WRAP_VALUE = {
  nowrap: 'nowrap',
  wrap: 'wrap',
  wrapReverse: 'wrap-reverse',
};

const FLEX_JUSTIFY_CONTENT_VALUE = {
  justifyStart: 'flex-start',
  justifyEnd: 'flex-end',
  justifyCenter: 'center',
  justifyBetween: 'space-between',
  justifyAround: 'space-around',
  justifyEvenly: 'space-evenly',
};

const FLEX_ALIGN_ITEM_VALUE = {
  itemsStart: 'flex-start',
  itemsEnd: 'flex-end',
  itemsCenter: 'center',
  itemsStretch: 'stretch',
  itemsBaseline: 'baseline',
};

const FLEX_ALIGN_SELF_VALUE = {
  selfStart: 'flex-start',
  selfEnd: 'flex-end',
  selfCenter: 'center',
  selfStretch: 'stretch',
  selfBaseline: 'baseline',
};

const GROW_SHRINK_VALUE = {
  '': 1,
  '0': 0,
};

export const FLEX_STYLE = {
  ...createStyleProp(FLEX_DIRECTION_VALUE, undefined, value => ({ flexDirection: value })),
  ...createStyleProp(FLEX_WRAP_VALUE, 'flexWrap', value => ({ flexWrap: value })),
  ...createStyleProp(FLEX_JUSTIFY_CONTENT_VALUE, undefined, value => ({ justifyContent: value })),
  ...createStyleProp(FLEX_ALIGN_ITEM_VALUE, undefined, value => ({ alignItems: value })),
  ...createStyleProp(FLEX_ALIGN_SELF_VALUE, undefined, value => ({ alignSelf: value })),
  ...createStyleProp(GROW_SHRINK_VALUE, 'grow', value => ({ flexGrow: value })),
  ...createStyleProp(GROW_SHRINK_VALUE, 'shrink', value => ({ flexShrink: value })),
  ...createStyleProp(spacing, 'gap', value => ({ gap: value })),
  ...createStyleProp(FLEX_SPECIFIC_VALUES, undefined, value => value),
};
