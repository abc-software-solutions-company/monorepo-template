import { FC, ReactElement, ReactNode } from 'react';
import { Provider } from 'react-redux';
import { render, RenderOptions } from '@testing-library/react';

import ErrorBoundary from '@/components/errors/error-boundary';
import { MediaContextProvider } from '@/components/media';

import { AppDataProvider } from '@/modules/app-data/components/app-data.provider';

import { store } from '@/stores/redux/store';

type AllTheProvidersProps = {
  children: ReactNode;
};

export const AllTheProviders: FC<AllTheProvidersProps> = ({ children }) => {
  return (
    <ErrorBoundary>
      <MediaContextProvider disableDynamicMediaQueries>
        <Provider store={store}>
          <AppDataProvider>{children}</AppDataProvider>
        </Provider>
      </MediaContextProvider>
    </ErrorBoundary>
  );
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';

export { customRender as render };
