import React from 'react';
import { Pressable } from 'react-native';
import { createDrawerNavigator, DrawerContentComponentProps, DrawerContentScrollView } from '@react-navigation/drawer';
import { ds } from '@repo/react-native-design-system';
import { dynamicStyles } from '@repo/react-native-design-system/utils/style.util';
import Heading from '@repo/react-native-ui-core/components/heading';
import Icon from '@repo/react-native-ui-core/components/icon';
import Separator from '@repo/react-native-ui-core/components/separator';
import Text from '@repo/react-native-ui-core/components/text';
import View from '@repo/react-native-ui-core/components/view';
import { useCoreUITheme } from '@repo/react-native-ui-core/themes/theme.context';

import { TravelDrawerParamList } from '../interfaces/navigation.interface';

import TravelBottomTabNavigator from './travel-bottom-tab';

const Drawer = createDrawerNavigator<TravelDrawerParamList>();

const DrawerContent = ({ ...props }: DrawerContentComponentProps) => {
  const { configs } = useCoreUITheme();

  const primaryForegroundColor = configs.primaryForeground;
  const foregroundColor = configs.foreground;
  const borderColor = configs.border;

  const isActive = (currentScreen: string) => currentScreen === 'home';

  return (
    <DrawerContentScrollView style={dynamicStyles.background(configs.card)} {...props}>
      <View style={[ds.pl16, ds.pb16]}>
        <Heading text="Travel Drawer" as={'h3'} color={foregroundColor} />
      </View>
      <Separator style={[ds.mb12, dynamicStyles.border(borderColor)]} />
      <View style={ds.pr16}>
        <Pressable
          style={[ds.row, ds.itemsCenter, ds.roundedRFull, ds.p12, isActive('UI') && dynamicStyles.background(configs.primary[500])]}
          onPress={() => props.navigation.navigate('UI')}
        >
          <Icon name="Camera" size={28} color={isActive('UI') ? primaryForegroundColor : foregroundColor} />
          <Text fontWeight={isActive('UI') ? 'Bold' : 'Regular'} color={isActive('UI') ? primaryForegroundColor : foregroundColor} style={ds.ml12}>
            UI Kit
          </Text>
        </Pressable>
        <Pressable
          style={[ds.row, ds.itemsCenter, ds.roundedRFull, ds.p12, isActive('ScanCode') && dynamicStyles.background(configs.primary[500])]}
          onPress={() => props.navigation.navigate('ScanCode')}
        >
          <Icon name="Camera" size={28} color={isActive('ScanCode') ? primaryForegroundColor : foregroundColor} />
          <Text
            fontWeight={isActive('ScanCode') ? 'Bold' : 'Regular'}
            color={isActive('ScanCode') ? primaryForegroundColor : foregroundColor}
            style={ds.ml12}
          >
            Scan Code
          </Text>
        </Pressable>
      </View>
    </DrawerContentScrollView>
  );
};

const CustomDrawerContent = (props: DrawerContentComponentProps) => <DrawerContent {...props} />;

const TravelDrawer = () => {
  return (
    <Drawer.Navigator drawerContent={CustomDrawerContent} screenOptions={{ headerShown: false, drawerType: 'front' }}>
      <Drawer.Screen name="TravelBottomTabStack" component={TravelBottomTabNavigator} />
    </Drawer.Navigator>
  );
};

export default TravelDrawer;
