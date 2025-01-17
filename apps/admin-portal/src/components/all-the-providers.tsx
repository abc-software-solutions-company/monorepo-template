import { ReactNode, useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { IntlProvider } from 'use-intl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';

import { MediaContextProvider } from '@/components/media';

import { AppDataProvider } from '@/modules/app-data/components/app-data.provider';
import { useAuthState } from '@/modules/auth/states/auth.state';
import { PreferenceEntity } from '@/modules/settings/interfaces/settings.interface';

import { getQueryClient } from '@/utils/query-client.util';

import { store } from '@/stores/redux/store';

import enMessages from '@/locales/en-us.json';
import viMessages from '@/locales/vi-vn.json';

import ErrorBoundary from './errors/error-boundary';

const queryClient = getQueryClient();
const asyncStoragePersister = createAsyncStoragePersister({ storage: AsyncStorage });

type AllTheProvidersProps = {
  children: ReactNode;
};

const getMessages = (language: string) => {
  switch (language) {
    case 'vi-vn':
      return viMessages;
    case 'en-us':
    default:
      return enMessages;
  }
};

function AllTheProviders({ children }: AllTheProvidersProps) {
  const { user, setPreference } = useAuthState();
  const [messages, setMessages] = useState<Record<string, string>>({});

  const language = user?.preference.language ?? 'en-us';
  const theme = user?.preference.theme ?? 'dark';

  useEffect(() => {
    if (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setPreference({ theme: 'dark' } as PreferenceEntity);
    }
  }, [setPreference, theme]);

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    const loadMessages = () => {
      const selectedMessages = getMessages(language);

      setMessages(selectedMessages);
    };

    loadMessages();
  }, [language]);

  if (Object.keys(messages).length === 0) return null;

  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister: asyncStoragePersister }}>
      <IntlProvider locale={language} messages={messages}>
        <ErrorBoundary>
          {/* TODO: Next to SPA <Tracking /> */}
          {/* TODO: Next to SPA <ServiceWorker /> */}
          <MediaContextProvider disableDynamicMediaQueries>
            <Provider store={store}>
              <AppDataProvider>{children}</AppDataProvider>
            </Provider>
          </MediaContextProvider>
          <ReactQueryDevtools buttonPosition="bottom-left" initialIsOpen={false} />
        </ErrorBoundary>
      </IntlProvider>
    </PersistQueryClientProvider>
  );
}

export default AllTheProviders;
