import React from 'react';
import BootSplash from 'react-native-bootsplash';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import { DefaultTheme, NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { ds } from '~react-native-design-system';
import { useCoreUITheme } from '~react-native-ui-core/themes/theme.context';

import GlobalModal from '@/components/global-modal/global-modal';

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

  const customTheme = Object.assign({}, DefaultTheme, {
    colors: {
      background: configs.background,
    },
  });

  return (
    <SafeAreaProvider style={ds.flex1}>
      <GestureHandlerRootView style={ds.flex1}>
        <NavigationContainer
          ref={navigationRef}
          theme={customTheme}
          linking={linking}
          onReady={() => {
            BootSplash.hide({ fade: true });
            SystemNavigationBar.setNavigationColor(configs.background);
          }}
          onStateChange={async () => {
            const currentRouteName = navigationRef.getCurrentRoute()?.name;

            log.extend('screen').info(currentRouteName);
          }}
        >
          <NavigationRoot />
          <GlobalModal />
        </NavigationContainer>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

export default NavContainer;
