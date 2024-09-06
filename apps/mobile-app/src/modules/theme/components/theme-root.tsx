import React, { FC } from 'react';

import ThemeList from './theme-list';

type ThemeRootProps = {};

const ThemeRoot: FC<ThemeRootProps> = () => {
  return <ThemeList themes={['dark', 'light', 'system']} />;
};

export default ThemeRoot;
