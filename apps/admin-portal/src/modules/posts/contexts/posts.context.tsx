import React, { createContext, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLocale } from 'use-intl';
import useDeepCompareEffect from '@repo/shared-universal/hooks/use-deep-compare-effect';
import { objectToQueryString } from '@repo/shared-universal/utils/string.util';

import { ResponseMeta } from '@/interfaces/api-response.interface';
import { PostEntity, PostFilter } from '../interfaces/posts.interface';

import { POST_DEFAULT_FILTER } from '../constants/posts.constant';

import { useGetPostsQuery } from '../hooks/use-post-queries';

type PostContextType = {
  filter: PostFilter;
  isFetching: boolean;
  isError: boolean;
  error: Error | null;
  meta?: ResponseMeta;
  items: PostEntity[];
  selected: string[];
  selectedIds: Record<string, boolean>;
  setFilter: React.Dispatch<React.SetStateAction<PostFilter>>;
  toggleSelect: (id: string) => void;
  toggleSelectAll: (value: boolean) => void;
  clearSelection: () => void;
};

export const PostContext = createContext<PostContextType | undefined>(undefined);

type PostProviderProps = {
  children: React.ReactNode;
};

export const PostProvider: React.FC<PostProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const locale = useLocale();
  const [filter, setFilter] = useState<PostFilter>({
    q: searchParams.get('q') || POST_DEFAULT_FILTER.q,
    page: parseInt(searchParams.get('page') as string) || POST_DEFAULT_FILTER.page,
    limit: parseInt(searchParams.get('limit') as string) || POST_DEFAULT_FILTER.limit,
    order: searchParams.get('order') || POST_DEFAULT_FILTER.order,
    status: searchParams.getAll('status') || POST_DEFAULT_FILTER.status,
    type: searchParams.get('type') || POST_DEFAULT_FILTER.type,
  });

  const [selected, setSelected] = useState<string[]>([]);
  const { data, isFetching, isError, error } = useGetPostsQuery(filter);

  // useEffect(() => {
  //   setFilter({ ...filter, type: searchParams.get('type') });
  // }, [searchParams]);

  useDeepCompareEffect(() => {
    const queryString = objectToQueryString({ ...filter, sidebar: searchParams.get('sidebar') });

    navigate({ pathname: `/${locale}/posts`, search: `?${queryString}` });
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

  return <PostContext.Provider value={contextValue}>{children}</PostContext.Provider>;
};
