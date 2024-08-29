import { useContext } from 'react';

import { FaqContext } from '../contexts/faqs.context';

export const useFaqs = () => {
  const context = useContext(FaqContext);

  if (context === undefined) {
    throw new Error('useFaqs must be used within a FaqProvider');
  }

  return context;
};
