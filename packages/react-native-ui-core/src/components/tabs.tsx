import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Appearance, Pressable, StyleProp, ViewStyle } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { ds } from '@repo/react-native-design-system';
import { dynamicStyles } from '@repo/react-native-design-system/utils/style.util';

import Text from './text';
import View from './view';

import { useCoreUITheme } from '../themes/theme.context';

interface ITabsContextProps {
  activeTab: string;
  setActiveTab: (id: string) => void;
}
const TabsContext = createContext<ITabsContextProps>({
  activeTab: '',
  setActiveTab: () => {},
});

interface ITabsProps {
  defaultValue: string;
  children: React.ReactNode;
  onChange?: (value: string) => void;
}
function Tabs({ defaultValue, children, onChange }: ITabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  const memoizedOnChange = useCallback((value: string) => onChange?.(value), [onChange]);

  useEffect(() => {
    memoizedOnChange(activeTab);
  }, [activeTab, memoizedOnChange]);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <View style={ds.flex1}>{children}</View>
    </TabsContext.Provider>
  );
}

interface ITabsListProps extends React.ComponentPropsWithoutRef<typeof View> {
  style?: StyleProp<ViewStyle>;
}
function TabsList({ style, ...props }: ITabsListProps) {
  const { configs } = useCoreUITheme();

  return (
    <View style={[ds.p4, ds.rounded12, dynamicStyles.background(configs.card), style]}>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <View style={[ds.row]} {...props} />
      </ScrollView>
    </View>
  );
}

interface ITabsTriggerProps extends React.ComponentPropsWithoutRef<typeof Pressable> {
  value: string;
  text?: string;
}
function TabsTrigger({ value, text, ...props }: ITabsTriggerProps) {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  const { theme } = useCoreUITheme();

  let activeTabStyle: ViewStyle;

  switch (theme) {
    case 'dark':
      activeTabStyle = ds.bgBlack;
      break;
    case 'light':
      activeTabStyle = ds.bgWhite;
      break;
    default:
      activeTabStyle = Appearance.getColorScheme() === 'dark' ? ds.bgBlack : ds.bgWhite;
      break;
  }

  return (
    <Pressable
      style={[ds.px12, ds.py10, ds.rounded8, ds.itemsCenter, ds.justifyCenter, activeTab === value && activeTabStyle]}
      onPress={() => setActiveTab(value)}
      {...props}
    >
      <Text fontWeight={activeTab === value ? 'Bold' : 'Medium'}>{text}</Text>
    </Pressable>
  );
}

interface ITabsContentProps extends React.ComponentPropsWithoutRef<typeof View> {
  value: string;
}
function TabsContent({ value, ...props }: ITabsContentProps) {
  const { activeTab } = useContext(TabsContext);

  const { style, ...rest } = props;

  if (value === activeTab) return <View style={[ds.grow, style]} {...rest} />;

  return null;
}

export { Tabs, TabsContent, TabsList, TabsTrigger };
