import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { MMKVStorage } from '@/utils/mmkv-storage.util';

type States = {
  theme: string;
};

type Actions = {
  setTheme: (theme: string) => void;
};

const initialState: States = {
  theme: 'system',
};

export const useThemeState = create<States & Actions>()(
  devtools(
    immer(
      persist(
        set => ({
          ...initialState,
          setTheme: theme => {
            set(state => {
              state.theme = theme;
            });
          },
        }),
        {
          name: '@theme',
          storage: createJSONStorage(() => MMKVStorage),
        }
      )
    ),
    { enabled: true }
  )
);
