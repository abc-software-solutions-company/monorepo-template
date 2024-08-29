import { FC, useMemo, useState } from 'react';
import axios from 'axios';
import classNames from 'classnames';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useLocale, useTranslations } from 'use-intl';
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
import { Checkbox } from '~react-web-ui-shadcn/components/ui/checkbox';
import Pagination from '~react-web-ui-shadcn/components/ui/pagination-custom';
import { objectToQueryString } from '~shared-universal/utils/string.util';

import { ComponentBaseProps } from '@/interfaces/component.interface';
import { ContentEntity, ContentResponse, ContentsResponse } from '../interfaces/contents.interface';

import { CONTENT_ACTION, CONTENT_STATUS, CONTENT_STATUSES, QUERY_CONTENT_LIST } from '../constants/contents.constant';

import { useBulkDestroyContentsMutation, useDestroyContentMutation } from '../hooks/use-content-queries';
import { useContents } from '../hooks/use-contents';

import { DataTable } from '@/components/data-table/data-table';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import DataTableRowAction from '@/components/data-table/data-table-row-action';
import DataTableRowStatus from '@/components/data-table/data-table-row-status';
import ItemsPerPage from '@/components/item-per-page';
import ModalConfirm from '@/components/modals/modal-confirm';
import PaginationInfo from '@/components/pagination-info';

import { toDateTime } from '@/utils/date.util';
import { getQueryClient } from '@/utils/query-client.util';

import ContentListToolbar from './content-list-toolbar';

const queryClient = getQueryClient();

const ContentList: FC<ComponentBaseProps> = ({ className }) => {
  const t = useTranslations();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const locale = useLocale();
  const [action, setAction] = useState<{ name: string; data?: ContentEntity }>({ name: '' });
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const { items, meta, selected, selectedIds, isFetching, filter, setFilter, toggleSelect, toggleSelectAll, clearSelection } = useContents();
  const { mutateAsync: destroyMutation } = useDestroyContentMutation();
  const { mutateAsync: bulkDestroyMutation } = useBulkDestroyContentsMutation();
  const [rowSelection, setRowSelection] = useState<RowSelectionState>(selectedIds);
  const columns: ColumnDef<ContentEntity>[] = useMemo(
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
        accessorKey: 'name',
        size: 0,
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('content_name')} />,
        cell: ({ row }) => {
          return (
            <div className="flex items-center">
              <button
                className="text-left hover:underline"
                onClick={() =>
                  navigate({
                    pathname: `/${locale}/contents/${row.original.id}/edit`,
                    search: `?${objectToQueryString({ sidebar: searchParams.get('sidebar') })}`,
                  })
                }
              >
                {row.getValue('name')}
              </button>
            </div>
          );
        },
      },
      {
        accessorKey: 'createdAt',
        size: 180,
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('content_created_at')} />,
        cell: ({ row }) => {
          const date = new Date(row.getValue('createdAt'));

          return <p className="text-muted-foreground">{toDateTime(date, locale)}</p>;
        },
      },
      {
        accessorKey: 'status',
        size: 130,
        header: ({ column }) => <DataTableColumnHeader className="text-center" column={column} title={t('content_status')} />,
        cell: ({ row }) => {
          const status = CONTENT_STATUSES.find(x => x.value === row.getValue('status'));

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
            <strong>{t('content_actions')}</strong>
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center justify-center">
            <DataTableRowAction
              items={[{ label: t('content_delete'), action: CONTENT_ACTION.DELETE }]}
              onAction={actionName => setAction({ name: actionName, data: row.original })}
            />
          </div>
        ),
      },
    ],
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

  const onDeleteContentSuccess = async (resp: ContentResponse, id: string) => {
    queryClient.setQueryData<ContentsResponse>([QUERY_CONTENT_LIST, filter], cached => {
      if (!cached || !cached.data) return cached;

      const updatedData = cached.data.map(item => (item.id === id ? { ...item, status: CONTENT_STATUS.DELETED } : item));

      return { ...cached, data: updatedData };
    });

    toast(t('content_delete_toast_title'), { description: t('content_delete_success') });
  };

  const onDeleteFailure = (error: Error, _id: string) => {
    let errorMessage = t('content_delete_failure');

    if (axios.isAxiosError(error) && error.response) {
      errorMessage += `\n${error.response.data.message}`;
    } else {
      errorMessage += `\n${error.message}`;
    }

    toast(t('content_delete_toast_title'), { description: errorMessage });
  };

  const onBulkDeleteSuccess = (resp: ContentsResponse, ids: string[]) => {
    queryClient.setQueryData<ContentsResponse>([QUERY_CONTENT_LIST, filter], cached => {
      if (!cached || !cached.data) return cached;

      const updatedData = cached.data.map(item => (ids.includes(item.id) ? { ...item, status: CONTENT_STATUS.DELETED } : item));

      return { ...cached, data: updatedData };
    });

    table.resetRowSelection(false);
    clearSelection();
    toast(t('content_delete_toast_title'), { description: t('content_delete_success') });
  };

  const onBulkDeleteFailure = (error: Error) => {
    let errorMessage = t('content_bulk_delete_failure');

    if (axios.isAxiosError(error) && error.response) {
      errorMessage += `\n${error.response.data.message}`;
    } else {
      errorMessage += `\n${error.message}`;
    }

    toast(t('content_delete_toast_title'), { description: errorMessage });
  };

  return (
    <div className={classNames('contents-list flex grow flex-col rounded-lg border bg-card p-4 text-card-foreground shadow-sm', className)}>
      <div className="relative flex h-full grow flex-col">
        <ContentListToolbar table={table} onBulkDelete={() => setAction({ name: CONTENT_ACTION.BULK_DELETE })} />
        <DataTable table={table} columns={columns} isFetching={isFetching} />
      </div>
      <div className="mt-3 flex justify-between">
        <div className="flex items-center space-x-2">
          <ItemsPerPage limit={filter?.limit} onFilter={value => setFilter({ ...filter, page: 1, limit: +value })} />
          <PaginationInfo amount={meta?.paging?.totalItems} text={t('content_records')} />
        </div>
        <Pagination
          totalItems={meta?.paging?.totalItems || 0}
          currentPage={meta?.paging?.currentPage}
          itemPerPage={meta?.paging?.itemsPerPage}
          onChange={page => setFilter({ ...filter, page })}
        />
      </div>
      <ModalConfirm
        visible={action.name === CONTENT_ACTION.DELETE}
        title={t('delete')}
        content={
          <>
            <span>{t('content_delete_message')}</span>
            <strong className="ml-1">{action.data?.name}?</strong>
          </>
        }
        onYes={() => {
          destroyMutation(action.data?.id as string, {
            onSuccess: onDeleteContentSuccess,
            onError: onDeleteFailure,
          });
          setAction({ name: '' });
        }}
        onNo={() => setAction({ name: '' })}
      />
      <ModalConfirm
        visible={action.name === CONTENT_ACTION.BULK_DELETE}
        title={t('bulk_delete')}
        content={<span>{t('content_bulk_delete_message')}</span>}
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

export default ContentList;
