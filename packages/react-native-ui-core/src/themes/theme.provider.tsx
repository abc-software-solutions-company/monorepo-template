import React, { createContext, ReactNode, useEffect, useMemo, useState } from 'react';
import { Appearance } from 'react-native';
import { PortalProvider } from '@repo/react-native-ui-core/components/portal';
import { Theme, ThemeConfigs } from '@repo/react-native-ui-core/interfaces/theme.interface';

import { defaultDarkTheme, defaultLightTheme } from './theme.config';

type ThemeContextType = {
  theme: Theme;
  configs: ThemeConfigs;
  setConfigs: (config: ThemeConfigs) => void;
  setTheme: (theme: Theme) => void;
};

const defaultTheme = Appearance.getColorScheme();
const defaultConfigs = defaultTheme === 'dark' ? defaultDarkTheme : defaultLightTheme;

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  configs: defaultConfigs,
  setConfigs: () => {},
  setTheme: () => {},
});

type CoreUIThemeProviderProps = {
  children: ReactNode;
  activeTheme?: Theme;
  activeConfigs?: ThemeConfigs;
  customTheme?: {
    dark?: Partial<ThemeConfigs>;
    light?: Partial<ThemeConfigs>;
  };
};

export const CoreUIThemeProvider: React.FC<CoreUIThemeProviderProps> = ({ children, activeTheme = Appearance.getColorScheme(), customTheme }) => {
  const [theme, setTheme] = useState<Theme>(activeTheme as Theme);
  const [configs, setConfigs] = useState<ThemeConfigs>(defaultConfigs);
  const customDarkTheme = useMemo(() => ({ ...defaultDarkTheme, ...customTheme?.dark }), [customTheme]);
  const customLightTheme = useMemo(() => ({ ...defaultLightTheme, ...customTheme?.light }), [customTheme]);

  const applyConfigs = (themeName: Theme) => {
    switch (themeName) {
      case 'dark':
        setConfigs(customDarkTheme);
        break;
      case 'light':
        setConfigs(customLightTheme);
        break;
      case 'system':
        setConfigs(Appearance.getColorScheme() === 'dark' ? customDarkTheme : customLightTheme);
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

  return (
    <ThemeContext.Provider value={{ theme, configs, setTheme, setConfigs }}>
      <PortalProvider>{children}</PortalProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
