import React from 'react';
import { useTranslation } from 'react-i18next';
import { ds } from '~react-native-design-system';
import IconButton from '~react-native-ui-core/components/icon-button';
import StatusBar from '~react-native-ui-core/components/statusbar';

import SafeViewArea from '@/components/safe-view-area';

import NavigationHeader from '@/modules/navigation/components/navigation-header';
import { AuthenticatedStackProps } from '@/modules/navigation/interfaces/navigation.interface';
import { getHeaderTitle } from '@/modules/navigation/utils/navigation.util';
import ThemeRoot from '@/modules/theme/components/theme-root';

function SettingThemeScreen({ navigation, route }: AuthenticatedStackProps<'SettingTheme'>) {
  const { t } = useTranslation();

  return (
    <SafeViewArea>
      <StatusBar />
      <NavigationHeader
        leftComponent={<IconButton name="ChevronLeft" />}
        leftFunc={() => navigation.goBack()}
        title={t(getHeaderTitle(route.name))}
      />
      <ThemeRoot />
    </SafeViewArea>
  );
}

export default SettingThemeScreen;
