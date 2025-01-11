import React, { FC } from 'react';
import { Platform, Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';
import appleAuth from '@invertase/react-native-apple-authentication';
import Auth from '@react-native-firebase/auth';
import { ds } from '@repo/react-native-design-system';
import { useMutation } from '@tanstack/react-query';

import { OAuthAppleSignInDto } from '../interfaces/auth.interface';

import { AUTH_AUTHENTICATOR } from '../constants/auth.constant';

import BrandApple from '@/components/svgs/brand-apple';

import log from '@/utils/logger.util';

import AuthApi from '../api/auth.api';
import { useAuthState } from '../states/auth.state';

interface IAppleSignInProps {
  style?: StyleProp<PressableProps | ViewStyle>;
}

const AppleSignIn: FC<IAppleSignInProps> = ({ style }) => {
  const authState = useAuthState();

  const mutation = useMutation({
    mutationFn: async (oAuthAppleSignInDto: OAuthAppleSignInDto) => {
      const { authenticator } = oAuthAppleSignInDto;

      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      });

      if (!appleAuthRequestResponse.identityToken) {
        throw new Error('Apple Sign-In failed - no identify token returned');
      }

      const { identityToken, nonce } = appleAuthRequestResponse;

      if (authenticator === AUTH_AUTHENTICATOR.FIREBASE) {
        const appleCredential = Auth.AppleAuthProvider.credential(identityToken, nonce);
        const appleSignInRes = await Auth().signInWithCredential(appleCredential);
        const userIdToken = await appleSignInRes.user.getIdToken();

        return AuthApi.appleSignIn(authenticator, userIdToken);
      } else {
        return AuthApi.appleSignIn(authenticator, identityToken);
      }
    },
    onSuccess: resp => {
      authState.setAuthenticated(true);
      authState.setAccessToken(resp.data.data.accessToken);
      authState.setUser(resp.data.data.user);
      log.extend('auth').info('Login Apple Success');
    },
    onError: error => log.extend('auth').error('Login Apple Failed', error),
  });

  if (Platform.OS !== 'ios') return null;

  return (
    <Pressable
      style={[ds.row, ds.itemsCenter, ds.justifyCenter, style]}
      onPress={() => {
        mutation.mutate({
          authenticator: AUTH_AUTHENTICATOR.SELF_HOSTED,
        });
      }}
    >
      <BrandApple size={36} />
    </Pressable>
  );
};

export default AppleSignIn;
