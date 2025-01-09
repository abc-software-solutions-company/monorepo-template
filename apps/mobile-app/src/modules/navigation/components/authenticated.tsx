import React from 'react';
import HelpCenterScreen from '@/screens/help-center.screen';
import PreloadScreen from '@/screens/preload.screen';
import PrivacyPolicyScreen from '@/screens/privacy-policy.screen';
import ScanCodeScreen from '@/screens/scanner.screen';
import SearchScreen from '@/screens/search.screen';
import SettingLanguageScreen from '@/screens/setting-language.screen';
import SettingThemeScreen from '@/screens/setting-theme.screen';
import SettingsScreen from '@/screens/settings.screen';
import SyncDataScreen from '@/screens/sync-data.screen';
import TermsAndConditionsScreen from '@/screens/terms-and-conditions.screen';
import UIScreen from '@/screens/ui.screen';
import { createStackNavigator } from '@react-navigation/stack';

import { AuthenticatedParamList } from '../interfaces/navigation.interface';

import TravelDrawer from './travel-drawer';

const Stack = createStackNavigator<AuthenticatedParamList>();

const Authenticated = () => {
  return (
    <Stack.Navigator initialRouteName="Preload" screenOptions={{ headerShown: false }}>
      {/* BASE */}
      <Stack.Screen name="Preload" component={PreloadScreen} />
      <Stack.Screen name="Search" component={SearchScreen} options={{ presentation: 'transparentModal' }} />
      <Stack.Screen name="TermsAndConditions" component={TermsAndConditionsScreen} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
      <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="SettingLanguage" component={SettingLanguageScreen} />
      <Stack.Screen name="SettingTheme" component={SettingThemeScreen} />
      <Stack.Screen name="SyncData" component={SyncDataScreen} />
      {/* TRAVEL APP */}
      <Stack.Screen name="TravelDrawer" component={TravelDrawer} options={{ presentation: 'transparentModal' }} />
      {/* DEMO */}
      <Stack.Screen name="ScanCode" component={ScanCodeScreen} />
      <Stack.Screen name="UI" component={UIScreen} />
    </Stack.Navigator>
  );
};

export default Authenticated;
