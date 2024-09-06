import React, { FC } from 'react';
import { FlatList } from 'react-native-gesture-handler';
import { ds } from '~react-native-design-system';
import { Theme } from '~react-native-ui-core/interfaces/theme.interface';
import { useCoreUITheme } from '~react-native-ui-core/themes/theme.context';

import ThemeItem from './theme-item';

import { useThemeState } from '../states/theme.state';

type ThemeListProps = {
  themes: string[];
};

const ThemeList: FC<ThemeListProps> = ({ themes }) => {
  const themeState = useThemeState();
  const { setTheme } = useCoreUITheme();

  const handleSelectTheme = (theme: string) => {
    setTheme(theme as Theme);
    themeState.setTheme(theme);
  };

  return (
    <FlatList
      data={themes}
      keyExtractor={theme => theme}
      renderItem={({ item }) => <ThemeItem theme={item} onSelectTheme={handleSelectTheme} />}
      contentContainerStyle={[ds.p10, ds.grow, ds.column, ds.gap4]}
    />
  );
};

export default ThemeList;
