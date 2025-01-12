import React, { FC } from 'react';
import { FlatList } from 'react-native-gesture-handler';
import { ds } from '@repo/react-native-design-system';

import LanguageItem from './language-item';

import { useLanguageState } from '../states/language.state';

type LanguageListProps = {
  languages: string[];
};

const LanguageList: FC<LanguageListProps> = ({ languages }) => {
  const { setLanguage } = useLanguageState();

  const handleSelectLanguage = (lang: string) => {
    setLanguage(lang);
  };

  return (
    <FlatList
      data={languages}
      keyExtractor={lang => lang}
      renderItem={({ item }) => <LanguageItem language={item} onSelectLanguage={handleSelectLanguage} />}
      contentContainerStyle={[ds.p10, ds.grow, ds.column, ds.gap4]}
    />
  );
};

export default LanguageList;
