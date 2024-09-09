import React from 'react';
import { ToastProvider } from 'react-native-toast-notifications';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { Theme } from '~react-native-ui-core/interfaces/theme.interface';
import { CoreUIThemeProvider } from '~react-native-ui-core/themes/theme.provider';

import NavContainer from '@/modules/navigation/components/navigation-container';
import NotificationSetup from '@/modules/notifications/components/notification-setup';
import { useThemeState } from '@/modules/theme/states/theme.state';

import { MMKVStorage } from '@/utils/mmkv-storage.util';
import { getQueryClient } from '@/utils/query-client.util';

const queryClient = getQueryClient();
const asyncStoragePersister = createAsyncStoragePersister({ storage: MMKVStorage });

const App = () => {
  const themeState = useThemeState();

  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister: asyncStoragePersister }}>
      <CoreUIThemeProvider activeTheme={themeState.theme as Theme}>
        <ToastProvider duration={4000} placement="bottom" animationType="slide-in">
          <NavContainer />
          <NotificationSetup />
        </ToastProvider>
      </CoreUIThemeProvider>
    </PersistQueryClientProvider>
  );
};

export default App;
