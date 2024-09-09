import React from 'react';
import { useTranslation } from 'react-i18next';
import { ds } from '~react-native-design-system';
import StatusBar from '~react-native-ui-core/components/statusbar';
import View from '~react-native-ui-core/components/view';

import LanguageRoot from '@/modules/language/components/language-root';
import NavigationHeader from '@/modules/navigation/components/navigation-header';
import { AuthenticatedStackProps } from '@/modules/navigation/interfaces/navigation.interface';
import { getHeaderTitle } from '@/modules/navigation/utils/navigation.util';

function SettingLanguageScreen({ route }: AuthenticatedStackProps<'SettingLanguage'>) {
  const { t } = useTranslation();

  return (
    <View style={ds.flex1}>
      <StatusBar />
      <NavigationHeader title={t(getHeaderTitle(route.name))} />
      <LanguageRoot />
    </View>
  );
}

export default SettingLanguageScreen;
