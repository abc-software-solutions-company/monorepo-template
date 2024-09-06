import React, { FC } from 'react';

import { LanguageList as LangCodes } from '../constants/language.constant';

import LanguageList from './language-list';

type LanguageRootProps = {};

const LanguageRoot: FC<LanguageRootProps> = () => {
  return <LanguageList languages={LangCodes} />;
};

export default LanguageRoot;
