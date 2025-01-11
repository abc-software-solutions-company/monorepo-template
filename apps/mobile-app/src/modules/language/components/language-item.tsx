import React from 'react';
import { CheckIcon } from 'lucide-react-native';
import { Pressable } from 'react-native';
import { ds } from '@repo/react-native-design-system';
import { dynamicStyles } from '@repo/react-native-design-system/utils/style.util';
import Text from '@repo/react-native-ui-core/components/text';
import { useCoreUITheme } from '@repo/react-native-ui-core/themes/theme.context';

import { LanguageNames } from '../constants/language.constant';

import { useLanguageState } from '../states/language.state';

type LanguageItemProps = {
  language: string;
  onSelectLanguage: (lang: string) => void;
};
const LanguageItem: React.FC<LanguageItemProps> = ({ language, onSelectLanguage }) => {
  const { language: activeLanguge } = useLanguageState();
  const { configs } = useCoreUITheme();

  return (
    <Pressable
      style={[
        ds.row,
        ds.itemsCenter,
        ds.justifyBetween,
        ds.h56,
        ds.px14,
        ds.border1,
        ds.rounded12,
        dynamicStyles.background(configs.card),
        dynamicStyles.border(configs.border),
      ]}
      onPress={() => onSelectLanguage(language)}
    >
      <Text fontWeight="Bold">{LanguageNames[language as keyof typeof LanguageNames]}</Text>
      {language === activeLanguge && <CheckIcon size={24} color={configs.primary[500]} strokeWidth={2} />}
    </Pressable>
  );
};

export default LanguageItem;
