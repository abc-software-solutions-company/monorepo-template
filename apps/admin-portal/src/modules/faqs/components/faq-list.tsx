import { FC, useMemo, useState } from 'react';
import axios from 'axios';
import classNames from 'classnames';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useLocale, useTranslations } from 'use-intl';
import ModalConfirm from '@repo/react-web-ui-shadcn/components/modals/modal-confirm';
import { Checkbox } from '@repo/react-web-ui-shadcn/components/ui/checkbox';
import Pagination from '@repo/react-web-ui-shadcn/components/ui/pagination-custom';
import { toDateTime } from '@repo/shared-universal/utils/date.util';
import { objectToQueryString } from '@repo/shared-universal/utils/string.util';
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getSortedRowModel,
  RowSelectionState,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';

import { ComponentBaseProps } from '@/interfaces/component.interface';
import { FaqEntity, FaqResponse, FaqsResponse } from '../interfaces/faqs.interface';

import { FAQ_ACTION, FAQ_STATUS, FAQ_STATUSES, QUERY_FAQ_LIST } from '../constants/faqs.constant';

import { useBulkDestroyFaqsMutation, useDestroyFaqMutation } from '../hooks/use-faq-queries';
import { useFaqs } from '../hooks/use-faqs';

import { DataTable } from '@/components/data-table/data-table';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import DataTableRowAction from '@/components/data-table/data-table-row-action';
import DataTableRowStatus from '@/components/data-table/data-table-row-status';
import ItemsPerPage from '@/components/item-per-page';
import PaginationInfo from '@/components/pagination-info';

import { getQueryClient } from '@/utils/query-client.util';

import FaqListToolbar from './faq-list-toolbar';

const queryClient = getQueryClient();

const FaqList: FC<ComponentBaseProps> = ({ className }) => {
  const t = useTranslations();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const locale = useLocale();
  const [action, setAction] = useState<{ name: string; data?: FaqEntity }>({ name: '' });
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const { items, meta, selected, selectedIds, isFetching, filter, setFilter, toggleSelect, toggleSelectAll, clearSelection } = useFaqs();
  const { mutateAsync: destroyMutation } = useDestroyFaqMutation();
  const { mutateAsync: bulkDestroyMutation } = useBulkDestroyFaqsMutation();
  const [rowSelection, setRowSelection] = useState<RowSelectionState>(selectedIds);
  const columns: ColumnDef<FaqEntity>[] = useMemo(
    () => [
      {
        id: 'select',
        size: 48,
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllRowsSelected()}
            aria-label="Select all"
            className="translate-y-[2px]"
            onCheckedChange={value => {
              table.toggleAllRowsSelected(!!value);
              toggleSelectAll(!!value);
            }}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            defaultChecked={selected.includes(row.original.id)}
            checked={row.getIsSelected()}
            aria-label="Select row"
            className="translate-y-[2px]"
            onCheckedChange={value => {
              row.toggleSelected(!!value);
              toggleSelect(row.original.id);
            }}
          />
        ),
      },
      {
        accessorKey: 'title',
        size: 0,
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('faq_title')} />,
        cell: ({ row }) => {
          const name = row.original.titleLocalized?.find(x => x.lang === locale)?.value ?? '';
          const fallbackName = row.original.titleLocalized?.[0]?.value ?? '';

          return (
            <div className="flex items-center">
              <button
                className="text-left hover:underline"
                onClick={() =>
                  navigate({
                    pathname: `/${locale}/faqs/${row.original.id}/edit`,
                    search: `?${objectToQueryString({ sidebar: searchParams.get('sidebar') })}`,
                  })
                }
              >
                {name || fallbackName}
              </button>
            </div>
          );
        },
      },
      {
        accessorKey: 'createdAt',
        size: 180,
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('faq_created_at')} />,
        cell: ({ row }) => {
          const date = new Date(row.getValue('createdAt'));

          return <p className="text-muted-foreground">{toDateTime(date, locale)}</p>;
        },
      },
      {
        accessorKey: 'status',
        size: 130,
        header: ({ column }) => <DataTableColumnHeader className="text-center" column={column} title={t('faq_status')} />,
        cell: ({ row }) => {
          const status = FAQ_STATUSES.find(x => x.value === row.getValue('status'));

          if (!status) return null;

          return (
            <div className="text-center">
              <DataTableRowStatus status={status} />
            </div>
          );
        },
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
      },
      {
        id: 'actions',
        size: 110,
        header: () => (
          <div className="text-center">
            <strong>{t('faq_actions')}</strong>
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center justify-center">
            <DataTableRowAction
              items={[{ label: t('faq_delete'), action: FAQ_ACTION.DELETE }]}
              onAction={actionName => setAction({ name: actionName, data: row.original })}
            />
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items]
  );
  const table = useReactTable({
    data: items,
    columns,
    state: { sorting, columnVisibility, rowSelection, columnFilters },
    enableColumnResizing: false,
    enableRowSelection: true,
    manualPagination: true,
    enableFilters: true,
    enableSorting: true,
    getRowId: row => row.id.toString(),
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  const onDeleteFaqSuccess = async (resp: FaqResponse, id: string) => {
    queryClient.setQueryData<FaqsResponse>([QUERY_FAQ_LIST, filter], cached => {
      if (!cached || !cached.data) return cached;

      const updatedData = cached.data.map(item => (item.id === id ? { ...item, status: FAQ_STATUS.DELETED } : item));

      return { ...cached, data: updatedData };
    });

    toast(t('faq_delete_toast_title'), { description: t('faq_delete_success') });
  };

  const onDeleteFailure = (error: Error, _id: string) => {
    let errorMessage = t('faq_delete_failure');

    if (axios.isAxiosError(error) && error.response) {
      errorMessage += `\n${error.response.data.message}`;
    } else {
      errorMessage += `\n${error.message}`;
    }

    toast(t('faq_delete_toast_title'), { description: errorMessage });
  };

  const onBulkDeleteSuccess = (_resp: FaqsResponse, ids: string[]) => {
    queryClient.setQueryData<FaqsResponse>([QUERY_FAQ_LIST, filter], cached => {
      if (!cached || !cached.data) return cached;

      const updatedData = cached.data.map(item => (ids.includes(item.id) ? { ...item, status: FAQ_STATUS.DELETED } : item));

      return { ...cached, data: updatedData };
    });

    table.resetRowSelection(false);
    clearSelection();
    toast(t('faq_delete_toast_title'), { description: t('faq_delete_success') });
  };

  const onBulkDeleteFailure = (error: Error) => {
    let errorMessage = t('faq_bulk_delete_failure');

    if (axios.isAxiosError(error) && error.response) {
      errorMessage += `\n${error.response.data.message}`;
    } else {
      errorMessage += `\n${error.message}`;
    }

    toast(t('faq_delete_toast_title'), { description: errorMessage });
  };

  return (
    <div className={classNames('faqs-list flex grow flex-col rounded-lg border bg-card p-4 text-card-foreground shadow-sm', className)}>
      <div className="relative flex h-full grow flex-col">
        <FaqListToolbar table={table} onBulkDelete={() => setAction({ name: FAQ_ACTION.BULK_DELETE })} />
        <DataTable containerClassName="mt-4" table={table} columns={columns} isFetching={isFetching} />
      </div>
      <div className="mt-3 flex justify-between">
        <div className="flex items-center space-x-2">
          <ItemsPerPage limit={filter?.limit} onFilter={value => setFilter({ ...filter, page: 1, limit: +value })} />
          <PaginationInfo amount={meta?.paging?.totalItems} text={t('faq_records')} />
        </div>
        <Pagination
          totalItems={meta?.paging?.totalItems || 0}
          currentPage={meta?.paging?.currentPage}
          itemPerPage={meta?.paging?.itemsPerPage}
          onChange={page => setFilter({ ...filter, page })}
        />
      </div>
      <ModalConfirm
        visible={action.name === FAQ_ACTION.DELETE}
        title={t('delete')}
        message={
          <>
            <span>{t('faq_delete_message')}</span>
            <strong className="space-x-1">{action.data?.titleLocalized.find(x => x.lang === locale)?.value}</strong>
          </>
        }
        onYes={() => {
          destroyMutation(action.data?.id as string, {
            onSuccess: onDeleteFaqSuccess,
            onError: onDeleteFailure,
          });
          setAction({ name: '' });
        }}
        onNo={() => setAction({ name: '' })}
      />
      <ModalConfirm
        visible={action.name === FAQ_ACTION.BULK_DELETE}
        title={t('bulk_delete')}
        message={<span>{t('faq_bulk_delete_message')}</span>}
        onYes={() => {
          bulkDestroyMutation(selected, {
            onSuccess: onBulkDeleteSuccess,
            onError: onBulkDeleteFailure,
          });
          setAction({ name: '' });
        }}
        onNo={() => setAction({ name: '' })}
      />
    </div>
  );
};

export default FaqList;
