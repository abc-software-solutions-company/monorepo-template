/*
 * @Author: <Tin Tran> (tin.tran@abcdigital.io)
 * @Created: 2025-01-17 14:26:39
 */

import { useContext } from 'react';

import { ProductContext } from '../contexts/products.context';

export const useProducts = () => {
  const context = useContext(ProductContext);

  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }

  return context;
};
