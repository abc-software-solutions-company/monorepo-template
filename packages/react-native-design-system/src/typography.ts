import { calculateLineHeight } from './utils/font.util';
import { createStyleProp } from './utils/style.util';

export const TEXT_SIZE = {
  10: 10,
  12: 12,
  14: 14,
  16: 16,
  18: 18,
  20: 20,
  22: 22,
  24: 24,
  28: 28,
  30: 30,
  32: 32,
  36: 36,
  48: 48,
  64: 64,
  72: 72,
  96: 96,
  128: 128,
};

const FONT_WEIGHT_VALUE = {
  thin: 100,
  extraLight: 200,
  light: 300,
  normal: 400,
  medium: 500,
  semiBold: 600,
  bold: 700,
  extraBold: 800,
  black: 900,
};

const FONT_STYLE_VALUE = {
  normal: 'normal',
  italic: 'italic',
};

const TEXT_ALIGN_VALUE = {
  auto: 'auto',
  left: 'left',
  center: 'center',
  right: 'right',
  justify: 'justify',
};

const LETTER_SPACING_VALUE = {
  tighter: -0.8,
  tight: -0.4,
  normal: 0,
  wide: 0.4,
  wider: 0.8,
  widest: 1.6,
};

const LINE_HEIGHT_VALUE = {
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  11: 48,
  None: 1,
  Tight: 1.25,
  Snug: 1.375,
  Normal: 1.5,
  Relaxed: 1.625,
  Loose: 2,
};

const TEXT_DECORATION_LINE_VALUE = {
  underline: 'underline',
  noUnderline: 'none',
  lineThrough: 'line-through',
  underlineThrough: 'underline line-through',
};

const TEXT_TRANSFORM_VALUE = {
  uppercase: 'uppercase',
  lowercase: 'lowercase',
  capitalize: 'capitalize',
  normalCase: 'none',
};

const FONT_VARIANT_VALUE = {
  smallCaps: ['small-caps'],
  oldStyleNums: ['oldstyle-nums'],
  liningNums: ['lining-nums'],
  tabularNums: ['tabular-nums'],
  proportionalNums: ['proportional-nums'],
};

export const TYPOGRAPHY_STYLE = {
  ...createStyleProp(TEXT_SIZE, 'text', value => ({ fontSize: value, lineHeight: calculateLineHeight(value) })),
  ...createStyleProp(FONT_WEIGHT_VALUE, 'font', value => ({ fontWeight: value })),
  ...createStyleProp(FONT_STYLE_VALUE, undefined, value => ({ fontStyle: value })),
  ...createStyleProp(TEXT_ALIGN_VALUE, 'text', value => ({ textAlign: value })),
  ...createStyleProp(LETTER_SPACING_VALUE, 'tracking', value => ({ letterSpacing: value })),
  ...createStyleProp(LINE_HEIGHT_VALUE, 'leading', value => ({ lineHeight: value })),
  ...createStyleProp(TEXT_DECORATION_LINE_VALUE, undefined, value => ({ textDecorationLine: value })),
  ...createStyleProp(TEXT_TRANSFORM_VALUE, undefined, value => ({ textTransform: value })),
  ...createStyleProp(FONT_VARIANT_VALUE, undefined, value => ({ fontVariant: value })),
};
