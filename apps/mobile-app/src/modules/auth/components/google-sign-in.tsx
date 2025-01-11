import React, { FC } from 'react';
import { Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';
import Config from 'react-native-config';
import Auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { ds } from '@repo/react-native-design-system';
import { useMutation } from '@tanstack/react-query';

import { OAuthGoogleSignInDto } from '../interfaces/auth.interface';

import { AUTH_AUTHENTICATOR } from '../constants/auth.constant';

import BrandGoogle from '@/components/svgs/brand-google';

import log from '@/utils/logger.util';

import AuthApi from '../api/auth.api';
import { useAuthState } from '../states/auth.state';

interface IGoogleSignInProps {
  style?: StyleProp<PressableProps | ViewStyle>;
}
GoogleSignin.configure({ webClientId: Config.RN_GOOGLE_WEB_CLIENT_ID });

const GoogleSignIn: FC<IGoogleSignInProps> = ({ style }) => {
  const authState = useAuthState();
  const mutation = useMutation({
    mutationFn: async (oAuthGoogleSignInDto: OAuthGoogleSignInDto) => {
      const { authenticator } = oAuthGoogleSignInDto;

      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

      const { idToken } = await GoogleSignin.signIn();

      if (!idToken) {
        throw new Error('Google Sign-In failed - no identify token returned');
      }

      if (authenticator === AUTH_AUTHENTICATOR.FIREBASE) {
        const ggAuthCredential = Auth.GoogleAuthProvider.credential(idToken);
        const googleSignInRes = await Auth().signInWithCredential(ggAuthCredential);
        const userIdToken = await googleSignInRes.user.getIdToken();

        return AuthApi.googleSignIn(authenticator, userIdToken);
      } else {
        return AuthApi.googleSignIn(authenticator, idToken);
      }
    },
    onSuccess: resp => {
      authState.setAuthenticated(true);
      authState.setAccessToken(resp.data.data.accessToken);
      authState.setUser(resp.data.data.user);
      log.extend('auth').info('Login Google Success');
    },
    onError: error => log.extend('auth').error('Login Google Failed', error),
  });

  return (
    <Pressable
      style={[ds.row, ds.itemsCenter, ds.justifyCenter, style]}
      onPress={() => {
        mutation.mutate({
          authenticator: AUTH_AUTHENTICATOR.SELF_HOSTED,
        });
      }}
    >
      <BrandGoogle size={36} />
    </Pressable>
  );
};

export default GoogleSignIn;
