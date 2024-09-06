'use client';

import React, { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';

import { MediaContextProvider } from '@/components/media';
import ServiceWorker from '@/components/service-worker';
import Tracking from '@/components/third-party/tracking';

import { AppDataProvider } from '@/modules/app-data/components/app-data.provider';

import { getQueryClient } from '@/utils/query-client.util';

import ErrorBoundary from './errors/error-boundary';

const queryClient = getQueryClient();
const asyncStoragePersister = createAsyncStoragePersister({ storage: AsyncStorage });

type AllTheProvidersProps = {
  children: ReactNode;
};

function AllTheProviders({ children }: AllTheProvidersProps) {
  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister: asyncStoragePersister }}>
      <SessionProvider>
        <ErrorBoundary>
          <Tracking />
          <ServiceWorker />
          <MediaContextProvider disableDynamicMediaQueries>
            <AppDataProvider>{children}</AppDataProvider>
          </MediaContextProvider>
          <ReactQueryDevtools buttonPosition="bottom-left" initialIsOpen={false} />
        </ErrorBoundary>
      </SessionProvider>
    </PersistQueryClientProvider>
  );
}

export default AllTheProviders;
