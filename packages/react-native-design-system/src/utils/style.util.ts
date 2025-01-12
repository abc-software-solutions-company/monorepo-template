/* eslint-disable @typescript-eslint/no-explicit-any */
import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { toCapitalized } from '@repo/shared-universal/utils/string.util';

type StaticStyle = ViewStyle | TextStyle | ImageStyle;
type DynamicStyleFunction = (...args: any[]) => StaticStyle;
type NamedStyles<T> = { [P in keyof T]: StaticStyle | DynamicStyleFunction };
type StyleProp<T extends Record<string | number, string>, P extends string | undefined> = {
  [K in keyof T as P extends undefined ? `${string & K}` : K extends number ? `${P}${K}` : `${P}${Capitalize<string & K>}`]: StaticStyle;
};
type StylePropNegative<T extends Record<string | number, number>> = {
  [K in keyof T as `${string & K}ne`]: T[K];
};

export function createStyle<T extends NamedStyles<T>>(styles: T) {
  const staticStyles: { [P in keyof T]?: StaticStyle } = {};
  const dynamicStyles: { [P in keyof T]?: DynamicStyleFunction } = {};

  for (const key in styles) {
    const style = styles[key];

    if (typeof style !== 'function') {
      staticStyles[key] = style as StaticStyle;
    } else {
      dynamicStyles[key] = style as DynamicStyleFunction;
    }
  }

  const createdStaticStyles = StyleSheet.create(staticStyles as { [P in keyof T]: StaticStyle });

  return { ...createdStaticStyles, ...dynamicStyles } as T;
}

export function createStyleProp<T extends Record<string, any>, P extends string | undefined>(
  styles: T,
  prefix: P,
  mapFn: (value: any) => StaticStyle
): StyleProp<T, P> {
  const result = {} as StyleProp<T, P>;

  for (const key in styles) {
    if (Object.prototype.hasOwnProperty.call(styles, key)) {
      const newKey = prefix ? `${prefix}${toCapitalized(String(key))}` : key;

      (result as Record<string, StaticStyle>)[newKey] = mapFn(styles[key]);
    }
  }

  return result;
}

export function getNegativeStyleProp<T extends Record<string, number>>(record: T): StylePropNegative<T> {
  const result: StylePropNegative<T> = {} as StylePropNegative<T>;

  for (const key of Object.keys(record) as Array<keyof T>) {
    const newKey = `${String(key)}ne` as keyof StylePropNegative<T>;

    result[newKey] = -record[key] as StylePropNegative<T>[typeof newKey];
  }

  return result;
}

export const dynamicStyles = createStyle({
  background: (color: string): ViewStyle => ({ backgroundColor: color }),
  border: (color: string): ViewStyle => ({ borderColor: color }),
  color: (color: string): TextStyle => ({ color }),
  padding: (padding: number): ViewStyle => ({ padding }),
  size: (size: number): ViewStyle => ({ width: size, height: size }),
  paddingVertical: (padding: number): ViewStyle => ({ paddingVertical: padding }),
  paddingHorizontal: (padding: number): ViewStyle => ({ paddingHorizontal: padding }),
});
