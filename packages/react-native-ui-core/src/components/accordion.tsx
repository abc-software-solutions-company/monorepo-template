import React, { createContext, ReactElement, useContext, useState } from 'react';
import { Pressable, StyleProp, ViewStyle } from 'react-native';
import { ds } from '@repo/react-native-design-system';
import { dynamicStyles } from '@repo/react-native-design-system/utils/style.util';

import Collapsible from './collapsible';
import Icon from './icon';
import Text from './text';
import View from './view';

import { useCoreUITheme } from '../themes/theme.context';

type AccordionContextType = {
  activeItems: string[];
  toggleItem: (value: string) => void;
  type: 'single' | 'multiple';
};

const AccordionContext = createContext<AccordionContextType | undefined>(undefined);

type AccordionProps = {
  children: React.ReactNode;
  type?: 'single' | 'multiple';
  collapsible?: boolean;
  style?: StyleProp<ViewStyle>;
};

export const Accordion: React.FC<AccordionProps> = ({ children, type = 'single', style, collapsible = true }) => {
  const [activeItems, setActiveItems] = useState<string[]>([]);

  const toggleItem = (value: string) => {
    setActiveItems(prev => {
      if (type === 'multiple') {
        return prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value];
      } else {
        return prev.includes(value) && collapsible ? [] : [value];
      }
    });
  };

  return (
    <AccordionContext.Provider value={{ activeItems, toggleItem, type }}>
      <View style={style}>{children}</View>
    </AccordionContext.Provider>
  );
};

type AccordionItemProps = {
  children: React.ReactNode;
  value: string;
};

export const AccordionItem: React.FC<AccordionItemProps> = ({ children, value }) => {
  const context = useContext(AccordionContext);
  const { configs } = useCoreUITheme();

  if (!context) throw new Error('AccordionItem must be used within an Accordion');

  const isActive = context.activeItems.includes(value);

  return (
    <View style={[ds.border1, ds.rounded8, dynamicStyles.border(configs.border)]}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return React.cloneElement(child as ReactElement<any>, { isActive, onToggle: () => context.toggleItem(value) });
        }

        return child;
      })}
    </View>
  );
};

type AccordionTriggerProps = {
  children: React.ReactNode;
  isActive?: boolean;
  onToggle?: () => void;
};

export const AccordionTrigger: React.FC<AccordionTriggerProps> = ({ children, isActive, onToggle }) => {
  const { configs } = useCoreUITheme();

  return (
    <Pressable style={[ds.row, ds.itemsCenter, ds.justifyBetween, ds.px12, ds.py8]} onPress={onToggle}>
      <Text>{typeof children === 'string' ? children : 'Trigger'}</Text>
      <Icon name={isActive ? 'ChevronUp' : 'ChevronDown'} size={20} color={configs.foreground} />
    </Pressable>
  );
};

type AccordionContentProps = {
  children: React.ReactNode;
  isActive?: boolean;
};

export const AccordionContent: React.FC<AccordionContentProps> = ({ children, isActive }) => {
  return (
    <Collapsible expanded={isActive === true}>
      <View style={[ds.px12, ds.py8]}>{typeof children === 'string' ? <Text>{children}</Text> : children}</View>
    </Collapsible>
  );
};
