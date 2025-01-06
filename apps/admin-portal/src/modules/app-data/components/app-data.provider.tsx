import { ReactNode } from 'react';

import countries from '@/assets/country-list.json';

import { AppDataContext } from '../contexts/app-data.context';

interface IAppDataProviderProps {
  children: ReactNode;
}

export const AppDataProvider: React.FC<IAppDataProviderProps> = ({ children }) => {
  return <AppDataContext.Provider value={{ countries }}>{children}</AppDataContext.Provider>;
};
