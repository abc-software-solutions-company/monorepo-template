import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLocale } from 'use-intl';
import useDeepCompareEffect from '@repo/shared-universal/hooks/use-deep-compare-effect';
import { objectToQueryString } from '@repo/shared-universal/utils/string.util';
import { useQuery } from '@tanstack/react-query';

import { ResponseMeta } from '@/interfaces/api-response.interface';
import { AuditLogEntity, AuditLogFilter } from '../interfaces/audit-logs.interface';

import { AUDIT_LOG_DEFAULT_FILTER } from '../constants/audit-logs.constant';

import AuditLogApi from '../api/audit-logs.api';

type UseAuditLogsProps = {
  isFetching: boolean;
  meta?: ResponseMeta;
  items: AuditLogEntity[];
  filter: AuditLogFilter;
  setFilter: (filter: AuditLogFilter) => void;
};

export const useAuditLogs = (): UseAuditLogsProps => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const locale = useLocale();
  const [filter, setFilter] = useState<AuditLogFilter>({
    page: parseInt(searchParams.get('page') as string) || AUDIT_LOG_DEFAULT_FILTER.page,
    limit: parseInt(searchParams.get('limit') as string) || AUDIT_LOG_DEFAULT_FILTER.limit,
  });
  const { data, isFetching } = useQuery({
    queryKey: ['get-audit-logs', filter],
    queryFn: async () => {
      const response = await AuditLogApi.list(filter);

      return response.data;
    },
    staleTime: 0,
  });

  useDeepCompareEffect(() => {
    const queryString = objectToQueryString({ ...filter, sidebar: searchParams.get('sidebar') });

    navigate({
      pathname: `/${locale}/audit-logs`,
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
