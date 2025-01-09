import { StyleSheet } from 'react-native';

import { colors } from './config';
import { SPACING_STYLE } from './spacing';
import { BORDER_STYLE } from './border';
import { SIZE_STYLE } from './sizing';
import { EFFECT_STYLE } from './effect';
import { IMAGE_STYLE } from './image';
import { FLEX_STYLE } from './flex';
import { LAYOUT_STYLE } from './layout';
import { TYPOGRAPHY_STYLE } from './typography';
import { COLOR_STYLE } from './colors';

const styles = StyleSheet.create({
  heading1: { ...TYPOGRAPHY_STYLE.text36 },
  heading2: { ...TYPOGRAPHY_STYLE.text32 },
  heading3: { ...TYPOGRAPHY_STYLE.text28 },
  heading4: { ...TYPOGRAPHY_STYLE.text24 },
  heading5: { ...TYPOGRAPHY_STYLE.text20 },
  heading6: { ...TYPOGRAPHY_STYLE.text16 },
  ...SPACING_STYLE,
  ...BORDER_STYLE,
  ...SIZE_STYLE,
  ...EFFECT_STYLE,
  ...IMAGE_STYLE,
  ...FLEX_STYLE,
  ...LAYOUT_STYLE,
  ...TYPOGRAPHY_STYLE,
  ...COLOR_STYLE,
});

export { colors as Colors, styles as ds };
