import React, { createContext, ReactNode, useEffect, useMemo, useState } from 'react';
import { Appearance } from 'react-native';
import { Theme, ThemeConfigs } from '~react-native-ui-core/interfaces/theme.interface';

import { defaultDarkTheme, defaultLightTheme } from './theme.config';

type ThemeContextType = {
  theme: Theme;
  configs: ThemeConfigs;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  configs: defaultLightTheme,
  setTheme: () => {},
});

type CoreUIThemeProviderProps = {
  children: ReactNode;
  activeTheme?: Theme;
  customTheme?: {
    dark?: Partial<ThemeConfigs>;
    light?: Partial<ThemeConfigs>;
  };
};

export const CoreUIThemeProvider: React.FC<CoreUIThemeProviderProps> = ({ children, activeTheme = Appearance.getColorScheme(), customTheme }) => {
  const customDarkTheme = useMemo(() => ({ ...defaultDarkTheme, ...customTheme?.dark }), [customTheme]);
  const customLightTheme = useMemo(() => ({ ...defaultLightTheme, ...customTheme?.light }), [customTheme]);

  const initialConfigs = activeTheme === 'dark' ? customDarkTheme : customLightTheme;

  const [theme, setTheme] = useState<Theme>(activeTheme as Theme);
  const [configs, setConfigs] = useState<ThemeConfigs>(initialConfigs);

  const applyConfigs = (themeName: Theme) => {
    switch (themeName) {
      case 'dark':
        setConfigs(customDarkTheme);
        break;
      case 'light':
        setConfigs(customLightTheme);
        break;
      default:
        const systemTheme = Appearance.getColorScheme();

        setConfigs(systemTheme === 'dark' ? customDarkTheme : customLightTheme);
        break;
    }
  };

  useEffect(() => {
    applyConfigs(theme);
  }, [theme, customTheme]);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({}) => {
      if (theme === 'system') {
        applyConfigs(theme);
      }
    });

    return () => subscription.remove();
  }, [theme]);

  return <ThemeContext.Provider value={{ theme, configs, setTheme }}>{children}</ThemeContext.Provider>;
};

export default ThemeContext;
