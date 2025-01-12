import { createStyleProp, getNegativeStyleProp } from './utils/style.util';
import { spacing } from './config';

const spacingNegative = getNegativeStyleProp(spacing);

const SPACING_VALUE = { ...spacing, ...spacingNegative, auto: 'auto' };

export const SPACING_STYLE = {
  ...createStyleProp(SPACING_VALUE, 'm', value => ({ margin: value })),
  ...createStyleProp(SPACING_VALUE, 'mx', value => ({ marginHorizontal: value })),
  ...createStyleProp(SPACING_VALUE, 'my', value => ({ marginVertical: value })),
  ...createStyleProp(SPACING_VALUE, 'mt', value => ({ marginTop: value })),
  ...createStyleProp(SPACING_VALUE, 'mr', value => ({ marginRight: value })),
  ...createStyleProp(SPACING_VALUE, 'mb', value => ({ marginBottom: value })),
  ...createStyleProp(SPACING_VALUE, 'ml', value => ({ marginLeft: value })),

  ...createStyleProp(SPACING_VALUE, 'p', value => ({ padding: value })),
  ...createStyleProp(SPACING_VALUE, 'px', value => ({ paddingHorizontal: value })),
  ...createStyleProp(SPACING_VALUE, 'py', value => ({ paddingVertical: value })),
  ...createStyleProp(SPACING_VALUE, 'pt', value => ({ paddingTop: value })),
  ...createStyleProp(SPACING_VALUE, 'pr', value => ({ paddingRight: value })),
  ...createStyleProp(SPACING_VALUE, 'pb', value => ({ paddingBottom: value })),
  ...createStyleProp(SPACING_VALUE, 'pl', value => ({ paddingLeft: value })),
};
