import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLocale } from 'use-intl';
import useDeepCompareEffect from '@repo/shared-universal/hooks/use-deep-compare-effect';
import { objectToQueryString } from '@repo/shared-universal/utils/string.util';
import { useQuery } from '@tanstack/react-query';

import { ResponseMeta } from '@/interfaces/api-response.interface';
import { ContactEntity, ContactFilter } from '../interfaces/contacts.interface';

import { CONTACT_DEFAULT_FILTER } from '../constants/contacts.constant';

import AuditLogApi from '../api/contacts.api';

type UseContactsProps = {
  isFetching: boolean;
  meta?: ResponseMeta;
  items: ContactEntity[];
  filter: ContactFilter;
  setFilter: (filter: ContactFilter) => void;
};

export const useContacts = (): UseContactsProps => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const locale = useLocale();
  const [filter, setFilter] = useState<ContactFilter>({
    page: parseInt(searchParams.get('page') as string) || CONTACT_DEFAULT_FILTER.page,
    limit: parseInt(searchParams.get('limit') as string) || CONTACT_DEFAULT_FILTER.limit,
  });
  const { data, isFetching } = useQuery({
    queryKey: ['get-contacts', filter],
    queryFn: async () => {
      const response = await AuditLogApi.list(filter);

      return response.data;
    },
    gcTime: 0,
  });

  useDeepCompareEffect(() => {
    const queryString = objectToQueryString({ ...filter, sidebar: searchParams.get('sidebar') });

    navigate({
      pathname: `/${locale}/contacts`,
      search: `?${queryString}`,
    });
  }, [filter]);

  return {
    isFetching,
    meta: data?.meta,
    items: data?.data || [],
    filter,
    setFilter,
  };
};
