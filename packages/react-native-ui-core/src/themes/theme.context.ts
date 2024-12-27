import { useContext } from 'react';

import ThemeContext from './theme.provider';

export const useCoreUITheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useCoreUITheme must be used within a CoreUIThemeProvider');
  }

  const { theme, configs, setTheme, setConfigs } = context;

  return { theme, configs, setTheme, setConfigs };
};
