import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ToastProvider } from 'react-native-toast-notifications';
import { CoreUIThemeProvider } from '@repo/react-native-ui-core/themes/theme.provider';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';

import NavContainer from '@/modules/navigation/components/navigation-container';

import { MMKVStorage } from '@/utils/mmkv-storage.util';
import { getQueryClient } from '@/utils/query-client.util';

const queryClient = getQueryClient();
const asyncStoragePersister = createAsyncStoragePersister({ storage: MMKVStorage });

const App = () => {
  return (
    <GestureHandlerRootView>
      <PersistQueryClientProvider client={queryClient} persistOptions={{ persister: asyncStoragePersister }}>
        <CoreUIThemeProvider>
          <ToastProvider duration={4000} placement="bottom" animationType="slide-in">
            <NavContainer />
          </ToastProvider>
        </CoreUIThemeProvider>
      </PersistQueryClientProvider>
    </GestureHandlerRootView>
  );
};

export default App;
