import React, { createContext, useContext, useState } from 'react';
import { Appearance, Pressable, StyleProp, ViewStyle } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { ds } from '~react-native-design-system';
import { createStyle } from '~react-native-design-system/utils/style.util';

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
}
function Tabs({ defaultValue, children }: ITabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return <TabsContext.Provider value={{ activeTab, setActiveTab }}>{children}</TabsContext.Provider>;
}

interface ITabsListProps extends React.ComponentPropsWithoutRef<typeof View> {
  style?: StyleProp<ViewStyle>;
}
function TabsList({ style, ...props }: ITabsListProps) {
  const { configs } = useCoreUITheme();

  return (
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[ds.p6, ds.wFull]}
      style={[ds.rounded12, styles.tabList(configs.card), style]}
    >
      <View style={ds.row} {...props} />
    </ScrollView>
  );
}

interface ITabsTriggerProps extends React.ComponentPropsWithoutRef<typeof Pressable> {
  value: string;
}
function TabsTrigger({ value, children, ...props }: ITabsTriggerProps) {
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
      style={[ds.px12, ds.py10, ds.rounded8, ds.grow, ds.itemsCenter, ds.justifyCenter, activeTab === value && activeTabStyle]}
      onPress={() => setActiveTab(value)}
      {...props}
    >
      {children}
    </Pressable>
  );
}

interface ITabsContentProps extends React.ComponentPropsWithoutRef<typeof View> {
  value: string;
}
function TabsContent({ value, ...props }: ITabsContentProps) {
  const { activeTab } = useContext(TabsContext);

  if (value === activeTab) return <View {...props} />;

  return null;
}

export { Tabs, TabsContent, TabsList, TabsTrigger };

const styles = createStyle({
  tabList: (bgColor: string): ViewStyle => {
    return {
      backgroundColor: bgColor,
    };
  },
});
