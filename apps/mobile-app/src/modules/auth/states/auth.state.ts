import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { ResponseError } from '@/interfaces/api-response.interface';

import { UserEntity } from '@/modules/users/interfaces/users.interface';

import { MMKVStorage } from '@/utils/mmkv-storage.util';

import AuthApi from '../api/auth.api';

type State = {
  isAuthenticated: boolean;
  accessToken: string;
  user?: UserEntity;
} & ResponseError;

type Actions = {
  signOut: () => void;
  setAuthenticated: (value: boolean) => void;
  setAccessToken: (token: string) => void;
  setUser: (user: UserEntity) => void;
  reset: () => void;
};

const initialState: State = {
  isAuthenticated: false,
  accessToken: '',
};

export const useAuthState = create<State & Actions>()(
  devtools(
    immer(
      persist(
        (set, get) => ({
          ...initialState,
          signOut: async () => {
            AuthApi.signOut();
            get().reset();
          },
          setAuthenticated: value => {
            set(state => {
              state.isAuthenticated = value;
            });
          },
          setAccessToken: token => {
            set(state => {
              state.accessToken = token;
            });
          },
          setUser: user => {
            set(state => {
              state.user = user;
            });
          },

          reset: () => {
            set(state => {
              state.isAuthenticated = initialState.isAuthenticated;
              state.accessToken = initialState.accessToken;
              state.user = initialState.user;
            });
          },
        }),
        {
          name: '@auth',
          storage: createJSONStorage(() => MMKVStorage),
        }
      )
    ),
    { enabled: true }
  )
);
