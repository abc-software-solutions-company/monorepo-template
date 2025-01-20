import React, { createContext, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLocale } from 'use-intl';
import useDeepCompareEffect from '@repo/shared-universal/hooks/use-deep-compare-effect';
import { objectToQueryString } from '@repo/shared-universal/utils/string.util';

import { ResponseMeta } from '@/interfaces/api-response.interface';
import { ProductEntity, ProductFilter } from '../interfaces/products.interface';

import { PRODUCT_DEFAULT_FILTER, PRODUCT_TYPE } from '../constants/products.constant';

import { useGetProductsQuery } from '../hooks/use-product-queries';

type ProductContextType = {
  filter: ProductFilter;
  isFetching: boolean;
  isError: boolean;
  error: Error | null;
  meta?: ResponseMeta;
  items: ProductEntity[];
  selected: string[];
  selectedIds: Record<string, boolean>;
  setFilter: React.Dispatch<React.SetStateAction<ProductFilter>>;
  toggleSelect: (id: string) => void;
  toggleSelectAll: (value: boolean) => void;
  clearSelection: () => void;
};

export const ProductContext = createContext<ProductContextType | undefined>(undefined);

type ProductProviderProps = {
  children: React.ReactNode;
};

export const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const locale = useLocale();
  const [filter, setFilter] = useState<ProductFilter>({
    q: searchParams.get('q') || PRODUCT_DEFAULT_FILTER.q,
    page: parseInt(searchParams.get('page') as string) || PRODUCT_DEFAULT_FILTER.page,
    limit: parseInt(searchParams.get('limit') as string) || PRODUCT_DEFAULT_FILTER.limit,
    order: searchParams.get('order') || PRODUCT_DEFAULT_FILTER.order,
    status: searchParams.getAll('status') || PRODUCT_DEFAULT_FILTER.status,
    type: (searchParams.get('type') as PRODUCT_TYPE) || PRODUCT_DEFAULT_FILTER.type,
  });

  const [selected, setSelected] = useState<string[]>([]);
  const { data, isFetching, isError, error } = useGetProductsQuery(filter);

  useDeepCompareEffect(() => {
    const queryString = objectToQueryString({ ...filter, sidebar: searchParams.get('sidebar') });

    navigate({ pathname: `/${locale}/products`, search: `?${queryString}` });
  }, [filter, navigate, locale, searchParams]);

  const toggleSelect = (id: string) => {
    setSelected(prevSelected => {
      const isSelected = prevSelected.includes(id);

      return isSelected ? prevSelected.filter(selectedId => selectedId !== id) : [...prevSelected, id];
    });
  };

  const toggleSelectAll = (selectAll: boolean) => {
    if (!data?.data) return;

    const allIds = data.data.map(item => item.id);

    if (selectAll) {
      setSelected(prevSelected => Array.from(new Set([...prevSelected, ...allIds])));
    } else {
      setSelected(prevSelected => prevSelected.filter(id => !allIds.includes(id)));
    }
  };

  const clearSelection = () => setSelected([]);

  const contextValue = useMemo(
    () => ({
      filter,
      isFetching,
      isError,
      error,
      meta: data?.meta,
      items: data?.data || [],
      selected,
      selectedIds: selected.reduce((row, id) => ({ ...row, [id]: true }), {}),
      setFilter,
      toggleSelect,
      toggleSelectAll,
      clearSelection,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filter, isFetching, isError, error, data, selected]
  );

  return <ProductContext.Provider value={contextValue}>{children}</ProductContext.Provider>;
};
