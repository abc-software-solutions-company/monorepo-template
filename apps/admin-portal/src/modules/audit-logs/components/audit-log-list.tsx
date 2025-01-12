import { FC, useMemo, useState } from 'react';
import classNames from 'classnames';
import { EyeIcon } from 'lucide-react';
import { useLocale, useTranslations } from 'use-intl';
import { Badge } from '@repo/react-web-ui-shadcn/components/ui/badge';
import { Button } from '@repo/react-web-ui-shadcn/components/ui/button';
import Pagination from '@repo/react-web-ui-shadcn/components/ui/pagination-custom';
import { toDateTime } from '@repo/shared-universal/utils/date.util';
import { ColumnDef, getCoreRowModel, useReactTable } from '@tanstack/react-table';

import { ComponentBaseProps } from '@/interfaces/component.interface';
import { AuditLogEntity } from '../interfaces/audit-logs.interface';

import { AUDIT_LOG_STATUSES } from '../constants/audit-logs.constant';

import { useAuditLogs } from '../hooks/use-audit-logs';

import { DataTable } from '@/components/data-table/data-table';
import DataTableRowStatus from '@/components/data-table/data-table-row-status';
import ItemsPerPage from '@/components/item-per-page';
import PaginationInfo from '@/components/pagination-info';

import AuditLogDetailModal from './audit-log-detail-modal';
import AuditLogListFilter from './audit-log-list-filter';

type AuditLogListProps = {
  items?: AuditLogEntity[];
} & ComponentBaseProps;

export const AuditLogList: FC<AuditLogListProps> = ({ className }) => {
  const t = useTranslations();
  const locale = useLocale();
  const { items, meta, filter, isFetching, setFilter } = useAuditLogs();
  const [viewDetailId, setViewDetailId] = useState('');
  const columns: ColumnDef<AuditLogEntity>[] = useMemo(
    () => [
      {
        accessorKey: 'tableName',
        size: 100,
        header: () => (
          <div className="text-center">
            <strong>{t('audit_log_table_name')}</strong>
          </div>
        ),
        cell: ({ row }) => {
          return (
            <div className="flex items-center justify-center">
              <Badge className="text-xs" variant="secondary">
                {row.original.tableName.toUpperCase()}
              </Badge>
            </div>
          );
        },
      },
      {
        accessorKey: 'title',
        size: 350,
        header: () => <strong>{t('audit_log_record_title')}</strong>,
        cell: ({ row }) => {
          return (
            <div className="flex items-start space-x-3">
              <button className="text-left" onClick={() => setViewDetailId(row.original.id)}>
                {row.getValue('title')}
              </button>
            </div>
          );
        },
      },
      {
        accessorKey: 'action',
        size: 130,
        header: () => (
          <div className="text-center">
            <strong>{t('audit_log_action')}</strong>
          </div>
        ),
        cell: ({ row }) => {
          const status = AUDIT_LOG_STATUSES.find(x => x.value === row.getValue('action'));

          return (
            <div className="text-center">
              <DataTableRowStatus status={status} />
            </div>
          );
        },
      },
      {
        accessorKey: 'createdAt',
        size: 200,
        header: () => <strong>{t('audit_log_created_at')}</strong>,
        cell: ({ row }) => {
          const date = new Date(row.getValue('createdAt'));

          return <p className="text-sm text-muted-foreground">{toDateTime(date, locale)}</p>;
        },
      },
      {
        accessorKey: 'user',
        size: 300,
        header: () => <strong>{t('audit_log_user')}</strong>,
        cell: ({ row }) => {
          const user = row.original.user;

          return (
            <div className="flex space-x-2">
              <div className="max-w-64 truncate leading-none">
                {user && (
                  <>
                    <p className="text-sm">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </>
                )}
              </div>
            </div>
          );
        },
      },
      {
        id: 'actions',
        size: 110,
        header: () => (
          <div className="text-center">
            <strong>{t('audit_log_actions')}</strong>
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center justify-center">
            <Button variant={'secondary'} className="h-8 w-8 p-0" onClick={() => setViewDetailId(row.original.id)}>
              <EyeIcon size={16} />
            </Button>
          </div>
        ),
      },
    ],
    [locale, t]
  );
  const table = useReactTable({
    data: items,
    columns,
    enableColumnResizing: false,
    manualPagination: true,
    getRowId: row => row.id.toString(),
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className={classNames('audit-logs-list flex grow flex-col rounded-lg border bg-card p-4 text-card-foreground shadow-sm', className)}>
      <div className="relative flex h-full grow flex-col">
        <AuditLogListFilter filter={filter} setFilter={setFilter} />
        <DataTable containerClassName="mt-4" table={table} columns={columns} isFetching={isFetching} />
      </div>
      <div className="mt-3 flex justify-between">
        <div className="flex items-center space-x-2">
          <ItemsPerPage limit={filter?.limit} onFilter={value => setFilter({ ...filter, page: 1, limit: +value })} />
          <PaginationInfo amount={meta?.paging?.totalItems} text={t('audit_log_records')} />
        </div>
        <Pagination
          totalItems={meta?.paging?.totalItems}
          currentPage={meta?.paging?.currentPage}
          itemPerPage={meta?.paging?.itemsPerPage}
          onChange={page => setFilter({ ...filter, page })}
        />
      </div>
      <AuditLogDetailModal id={viewDetailId} visible={!!viewDetailId} onCancel={() => setViewDetailId('')} />
    </div>
  );
};
