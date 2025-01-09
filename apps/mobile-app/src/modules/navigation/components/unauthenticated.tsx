import React from 'react';
import ForgotPasswordScreen from '@/screens/forgot-password.screen';
import LoginScreen from '@/screens/login.screen';
import RegisterScreen from '@/screens/register.screen';
import ResetPasswordScreen from '@/screens/reset-password.screen';
import VerifyOtpScreen from '@/screens/verify-otp.screen';
import WelcomeScreen from '@/screens/welcome.screen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { UnauthenticatedParamList } from '../interfaces/navigation.interface';

const Stack = createNativeStackNavigator<UnauthenticatedParamList>();

const Unauthenticated = () => {
  return (
    <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false }} />
      <Stack.Screen name="VerifyOtp" component={VerifyOtpScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default Unauthenticated;
