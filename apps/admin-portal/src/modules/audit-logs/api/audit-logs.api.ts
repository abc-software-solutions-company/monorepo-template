import { EntityId } from '@reduxjs/toolkit';
import { objectToQueryString } from '@repo/shared-universal/utils/string.util';

import { AuditLogFilter, AuditLogResponse, AuditLogsResponse } from '../interfaces/audit-logs.interface';

import { API_ENDPOINTS } from '@/constants/api-endpoint.constant';

import axiosClient from '@/http/http-request';

export const list = (filter: AuditLogFilter) => {
  const url = API_ENDPOINTS.AUDIT_LOGS + '?' + objectToQueryString(filter);

  return axiosClient.get<AuditLogsResponse>(url);
};

export const read = (id: EntityId) => {
  return axiosClient.get<AuditLogResponse>(`${API_ENDPOINTS.AUDIT_LOGS}/${id}`);
};

const AuditLogApi = { list, read };

export default AuditLogApi;
