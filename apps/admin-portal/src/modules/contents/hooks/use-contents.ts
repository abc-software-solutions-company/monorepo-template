import { useContext } from 'react';

import { ContentContext } from '../contexts/contents.context';

export const useContents = () => {
  const context = useContext(ContentContext);

  if (context === undefined) {
    throw new Error('useContents must be used within a ContentProvider');
  }

  return context;
};
