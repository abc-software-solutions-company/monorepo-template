import React, { createContext, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLocale } from 'use-intl';
import useDeepCompareEffect from '@repo/shared-universal/hooks/use-deep-compare-effect';
import { objectToQueryString } from '@repo/shared-universal/utils/string.util';

import { ResponseMeta } from '@/interfaces/api-response.interface';
import { CategoryEntity, CategoryFilter } from '../interfaces/categories.interface';

import { CATEGORY_DEFAULT_FILTER, CATEGORY_TYPE } from '../constants/categories.constant';

import { useGetCategoriesQuery } from '../hooks/use-category-queries';

type CategoryContextType = {
  filter: CategoryFilter;
  isFetching: boolean;
  isError: boolean;
  error: Error | null;
  meta?: ResponseMeta;
  items: CategoryEntity[];
  selected: string[];
  selectedIds: Record<string, boolean>;
  setFilter: React.Dispatch<React.SetStateAction<CategoryFilter>>;
  toggleSelect: (id: string) => void;
  toggleSelectAll: (value: boolean) => void;
  clearSelection: () => void;
};

export const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

type CategoryProviderProps = {
  children: React.ReactNode;
};

export const CategoryProvider: React.FC<CategoryProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const locale = useLocale();
  const [filter, setFilter] = useState<CategoryFilter>({
    q: searchParams.get('q') || CATEGORY_DEFAULT_FILTER.q,
    page: parseInt(searchParams.get('page') as string) || CATEGORY_DEFAULT_FILTER.page,
    limit: parseInt(searchParams.get('limit') as string) || CATEGORY_DEFAULT_FILTER.limit,
    order: searchParams.get('order') || CATEGORY_DEFAULT_FILTER.order,
    status: searchParams.getAll('status') || CATEGORY_DEFAULT_FILTER.status,
    type: (searchParams.get('type') as CATEGORY_TYPE) || CATEGORY_DEFAULT_FILTER.type,
  });

  const [selected, setSelected] = useState<string[]>([]);
  const { data, isFetching, isError, error } = useGetCategoriesQuery({ filter });

  useDeepCompareEffect(() => {
    const queryString = objectToQueryString({ ...filter, sidebar: searchParams.get('sidebar') });

    navigate({ pathname: `/${locale}/categories`, search: `?${queryString}` });
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

  return <CategoryContext.Provider value={contextValue}>{children}</CategoryContext.Provider>;
};
