import React, { createContext, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLocale } from 'use-intl';
import useDeepCompareEffect from '@repo/shared-universal/hooks/use-deep-compare-effect';
import { objectToQueryString } from '@repo/shared-universal/utils/string.util';

import { ResponseMeta } from '@/interfaces/api-response.interface';
import { FaqEntity, FaqFilter } from '../interfaces/faqs.interface';

import { FAQ_DEFAULT_FILTER } from '../constants/faqs.constant';

import { useGetFaqsQuery } from '../hooks/use-faq-queries';

type FaqContextType = {
  filter: FaqFilter;
  isFetching: boolean;
  isError: boolean;
  error: Error | null;
  meta?: ResponseMeta;
  items: FaqEntity[];
  selected: string[];
  selectedIds: Record<string, boolean>;
  setFilter: React.Dispatch<React.SetStateAction<FaqFilter>>;
  toggleSelect: (id: string) => void;
  toggleSelectAll: (value: boolean) => void;
  clearSelection: () => void;
};

export const FaqContext = createContext<FaqContextType | undefined>(undefined);

type FaqProviderProps = {
  children: React.ReactNode;
};

export const FaqProvider: React.FC<FaqProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const locale = useLocale();
  const [filter, setFilter] = useState<FaqFilter>({
    q: searchParams.get('q') || FAQ_DEFAULT_FILTER.q,
    page: parseInt(searchParams.get('page') as string) || FAQ_DEFAULT_FILTER.page,
    limit: parseInt(searchParams.get('limit') as string) || FAQ_DEFAULT_FILTER.limit,
    order: searchParams.get('order') || FAQ_DEFAULT_FILTER.order,
    status: searchParams.getAll('status') || FAQ_DEFAULT_FILTER.status,
  });
  const [selected, setSelected] = useState<string[]>([]);
  const { data, isFetching, isError, error } = useGetFaqsQuery(filter);

  useDeepCompareEffect(() => {
    const queryString = objectToQueryString({ ...filter, sidebar: searchParams.get('sidebar') });

    navigate({ pathname: `/${locale}/faqs`, search: `?${queryString}` });
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

  return <FaqContext.Provider value={contextValue}>{children}</FaqContext.Provider>;
};
