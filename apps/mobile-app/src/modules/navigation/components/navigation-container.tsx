import React from 'react';
import BootSplash from 'react-native-bootsplash';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DarkTheme, NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { ds } from '@repo/react-native-design-system';
import { useCoreUITheme } from '@repo/react-native-ui-core/themes/theme.context';

import GlobalModal from '@/components/global-modal/global-modal';

import NotificationSetup from '@/modules/notifications/components/notification-setup';

import log from '@/utils/logger.util';

import NavigationRoot from './navigation-root';

const linking = {
  prefixes: ['com.tin.bully://'],
  config: {
    screens: {
      Login: {
        path: 'login',
      },
    },
  },
};

const NavContainer = () => {
  const navigationRef = useNavigationContainerRef();
  const { configs } = useCoreUITheme();

  return (
    <SafeAreaProvider style={ds.flex1}>
      <NavigationContainer
        ref={navigationRef}
        theme={{
          ...DarkTheme,
          colors: {
            ...DarkTheme.colors,
            background: configs.background,
          },
        }}
        linking={linking}
        onReady={() => {
          BootSplash.hide({ fade: true });
        }}
        onStateChange={async () => {
          const currentRouteName = navigationRef.getCurrentRoute()?.name;

          log.extend('screen').info(currentRouteName);
        }}
      >
        <NavigationRoot />
        <NotificationSetup />
        <GlobalModal />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default NavContainer;
