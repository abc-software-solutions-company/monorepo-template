import React from 'react';
import { Platform, Pressable } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { ds } from '@repo/react-native-design-system';
import { dynamicStyles } from '@repo/react-native-design-system/utils/style.util';
import Icon from '@repo/react-native-ui-core/components/icon';
import Text from '@repo/react-native-ui-core/components/text';
import View from '@repo/react-native-ui-core/components/view';
import { useCoreUITheme } from '@repo/react-native-ui-core/themes/theme.context';

export type TravelTabBarProps = {
  showText?: boolean;
} & BottomTabBarProps;

const TravelTabBar = ({ showText = false, ...rest }: TravelTabBarProps) => {
  const { configs } = useCoreUITheme();

  const renderIcon = (name: string, isFocused: boolean) => {
    let icon = null;
    const iconColor = isFocused ? configs.primary[500] : configs.foreground;

    switch (name) {
      case 'TravelExploreStack':
        icon = <Icon name="Compass" size={32} color={iconColor} />;
        break;
      case 'AccommodationStack':
        icon = <Icon name="Hotel" size={32} color={iconColor} />;
        break;
      case 'TourStack':
        icon = <Icon name="TentTree" size={32} color={iconColor} />;
        break;
      case 'NotificationStack':
        icon = <Icon name="Bell" size={32} color={iconColor} />;
        break;
      case 'ProfileStack':
        icon = <Icon name="User" size={32} color={iconColor} />;
        break;
    }

    return icon;
  };

  return (
    <View
      style={[
        ds.row,
        ds.justifyEvenly,
        ds.borderT1,
        dynamicStyles.background(configs.background),
        dynamicStyles.border(configs.border),
        Platform.OS === 'ios' && ds.h80,
      ]}
    >
      {rest.state.routes.map((route, index) => {
        const { options } = rest.descriptors[route.key];
        const label = options.tabBarLabel ?? options.title ?? route.name;
        const isFocused = rest.state.index === index;
        const color = isFocused ? configs.primary[500] : configs.foreground;

        const onPress = () => {
          const event = rest.navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });

          if (!isFocused && !event.defaultPrevented) {
            rest.navigation.navigate({ name: route.name, params: route.params });
          }
        };

        const onLongPress = () => {
          rest.navigation.emit({ type: 'tabLongPress', target: route.key });
        };

        return (
          <Pressable
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            style={[ds.itemsCenter, ds.p12]}
            onPress={onPress}
            onLongPress={onLongPress}
          >
            {renderIcon(route.name, isFocused)}
            {showText && (
              <Text color={color} fontSize={16}>
                {label.toString()}
              </Text>
            )}
          </Pressable>
        );
      })}
    </View>
  );
};

export default TravelTabBar;
