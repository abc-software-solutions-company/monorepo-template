import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createStackNavigator } from '@react-navigation/stack';

import { RootStackParamList } from '../interfaces/navigation.interface';

import SplashScreen from '@/components/splash-screen';

import { useAuthState } from '@/modules/auth/states/auth.state';
import { useLanguageState } from '@/modules/language/states/language.state';

import Anthenticated from './authenticated';
import Unanthenticated from './unauthenticated';

const Stack = createStackNavigator<RootStackParamList>();

const NavigationRoot = () => {
  const { i18n } = useTranslation();
  const authState = useAuthState();
  const { language } = useLanguageState();
  const [isShowSplash, setIsShowSplash] = useState(true);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [i18n, language]);

  if (isShowSplash) {
    return (
      <SplashScreen
        onAnimationEnd={() => {
          setIsShowSplash(false);
        }}
      />
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, presentation: 'transparentModal' }}>
      {authState.isAuthenticated ? (
        <Stack.Screen name="Anthenticated" component={Anthenticated} />
      ) : (
        <Stack.Screen name="Unanthenticated" component={Unanthenticated} />
      )}
    </Stack.Navigator>
  );
};

export default NavigationRoot;
