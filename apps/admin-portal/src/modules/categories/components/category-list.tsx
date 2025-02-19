import { FC, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import classNames from 'classnames';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useLocale, useTranslations } from 'use-intl';
import ModalConfirm from '@repo/react-web-ui-shadcn/components/modals/modal-confirm';
import { Checkbox } from '@repo/react-web-ui-shadcn/components/ui/checkbox';
import Pagination from '@repo/react-web-ui-shadcn/components/ui/pagination-custom';
import { toDateTime } from '@repo/shared-universal/utils/date.util';
import { objectToQueryString, repeatStr } from '@repo/shared-universal/utils/string.util';
import {
  ColumnDef,
  ColumnFiltersState,
  ExpandedState,
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getSortedRowModel,
  RowSelectionState,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';

import { ComponentBaseProps } from '@/interfaces/component.interface';
import { CategoriesResponse, CategoryEntity, CategoryResponse } from '../interfaces/categories.interface';

import { CATEGORY_ACTION, CATEGORY_STATUS, CATEGORY_STATUSES, CATEGORY_TYPE, QUERY_CATEGORY_LIST } from '../constants/categories.constant';

import { useCategories } from '../hooks/use-categories';
import { useBulkDestroyCategoriesMutation, useDestroyCategoryMutation } from '../hooks/use-category-queries';

import { DataTable } from '@/components/data-table/data-table';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import DataTableRowAction from '@/components/data-table/data-table-row-action';
import ItemsPerPage from '@/components/item-per-page';
import PaginationInfo from '@/components/pagination-info';

import { getQueryClient } from '@/utils/query-client.util';

import CategoryDetailModal from './category-detail-modal';
import CategoryListToolbar from './category-list-toolbar';
import CategoryRowStatus from './category-row-status';

const queryClient = getQueryClient();

const CategoryList: FC<ComponentBaseProps> = ({ className }) => {
  const t = useTranslations();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const locale = useLocale();
  const [viewDetailId, setViewDetailId] = useState('');
  const [action, setAction] = useState<{ name: string; data?: CategoryEntity }>({ name: '' });
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [expanded, setExpanded] = useState<ExpandedState>(true);
  const { items, meta, selected, selectedIds, isFetching, filter, setFilter, toggleSelect, toggleSelectAll, clearSelection } = useCategories();
  const { mutateAsync: destroyMutation } = useDestroyCategoryMutation();
  const { mutateAsync: bulkDestroyMutation } = useBulkDestroyCategoriesMutation();
  const [rowSelection, setRowSelection] = useState<RowSelectionState>(selectedIds);
  const columns = useMemo<ColumnDef<CategoryEntity>[]>(
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
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('category_title')} />,
        cell: ({ row }) => {
          const name = row.original.nameLocalized?.find(x => x.lang === locale)?.value ?? '';
          const fallbackName = row.original.nameLocalized?.[0]?.value ?? '';

          return (
            <div className="flex items-center space-x-1">
              <button
                className="space-x-2 text-left hover:underline"
                onClick={() =>
                  navigate({
                    pathname: `/${locale}/categories/${row.original.id}/edit`,
                    search: `?${objectToQueryString({
                      sidebar: searchParams.get('sidebar'),
                      type: searchParams.get('type'),
                    })}`,
                  })
                }
              >
                <span>
                  {repeatStr('└', '─', row.depth)}
                  {name || fallbackName}
                </span>
              </button>
              {row.getCanExpand() && (
                <button {...{ onClick: row.getToggleExpandedHandler() }}>
                  {row.getIsExpanded() ? <ChevronDown size={18} className="text-primary" /> : <ChevronRight size={18} className="text-primary" />}
                </button>
              )}
              <button className="p-1.5" onClick={() => setViewDetailId(row.original.id)}>
                <span className="text-primary">({t('view_detail')})</span>
              </button>
            </div>
          );
        },
      },
      {
        accessorKey: 'createdAt',
        size: 200,
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('category_created_at')} />,
        cell: ({ row }) => {
          const date = new Date(row.getValue('createdAt'));

          return <p className="text-sm text-muted-foreground">{toDateTime(date, locale)}</p>;
        },
      },
      {
        accessorKey: 'status',
        size: 120,
        header: ({ column }) => <DataTableColumnHeader className="text-center" column={column} title={t('category_status')} />,
        cell: ({ row }) => {
          const status = CATEGORY_STATUSES.find(x => x.value === row.getValue('status'));

          if (!status) return null;

          return (
            <div className="text-center">
              <CategoryRowStatus status={status} />
            </div>
          );
        },
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
      },
      {
        accessorKey: 'creator',
        size: 250,
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('category_author')} />,
        cell: ({ row }) => {
          const creator = row.original.creator;

          return (
            <div className="flex space-x-2">
              <div className="max-w-64 truncate leading-none">
                {creator && (
                  <>
                    <p>{creator.name}</p>
                    <p className="text-xs text-muted-foreground">{creator.email}</p>
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
            <strong>{t('category_actions')}</strong>
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center justify-center">
            <DataTableRowAction
              items={[
                { label: t('category_delete'), action: CATEGORY_ACTION.DELETE },
                {
                  label: t('category_auditlog'),
                  action: CATEGORY_ACTION.AUDIT_LOG,
                },
              ]}
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
    state: { sorting, columnVisibility, rowSelection, columnFilters, expanded },
    enableColumnResizing: false,
    enableRowSelection: true,
    manualPagination: true,
    enableFilters: true,
    enableSorting: true,
    getRowId: row => row.id.toString(),
    getSubRows: row => row.children as CategoryEntity[],
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  const onDeleteSuccess = async (resp: CategoryResponse, id: string) => {
    queryClient.setQueryData<CategoriesResponse>([QUERY_CATEGORY_LIST, filter], cached => {
      if (!cached || !cached.data) return cached;

      const updatedData = cached.data.map(item => (item.id === id ? { ...item, status: CATEGORY_STATUS.DELETED } : item));

      return { ...cached, data: updatedData };
    });

    toast(t('category_delete_toast_title'), { description: t('category_delete_success') });
  };

  const onDeleteFailure = (error: Error, _id: string) => {
    let errorMessage = t('category_delete_failure');

    if (axios.isAxiosError(error) && error.response) {
      errorMessage += `\n${error.response.data.message}`;
    } else {
      errorMessage += `\n${error.message}`;
    }

    toast(t('category_delete_toast_title'), { description: errorMessage });
  };

  const onBulkDeleteSuccess = (_resp: CategoriesResponse, ids: string[]) => {
    queryClient.setQueryData<CategoriesResponse>([QUERY_CATEGORY_LIST, filter], cached => {
      if (!cached || !cached.data) return cached;

      const updatedData = cached.data.map(item => (ids.includes(item.id) ? { ...item, status: CATEGORY_STATUS.DELETED } : item));

      return { ...cached, data: updatedData };
    });

    table.resetRowSelection(false);
    clearSelection();
    toast(t('category_delete_toast_title'), { description: t('category_delete_success') });
  };

  const onBulkDeleteFailure = (error: Error) => {
    let errorMessage = t('category_bulk_delete_failure');

    if (axios.isAxiosError(error) && error.response) {
      errorMessage += `\n${error.response.data.message}`;
    } else {
      errorMessage += `\n${error.message}`;
    }

    toast(t('category_delete_toast_title'), { description: errorMessage });
  };

  useEffect(() => {
    setFilter({ ...filter, type: searchParams.get('type') as CATEGORY_TYPE });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <div className={classNames('categories-list flex grow flex-col rounded-lg border bg-card p-4 text-card-foreground shadow-sm', className)}>
      <div className="relative flex h-full grow flex-col">
        <CategoryListToolbar table={table} onBulkDelete={() => setAction({ name: CATEGORY_ACTION.BULK_DELETE })} />
        <DataTable containerClassName="mt-4" table={table} columns={columns} isFetching={isFetching} />
      </div>
      <div className="mt-3 flex justify-between">
        <div className="flex items-center space-x-2">
          <ItemsPerPage limit={filter?.limit} onFilter={value => setFilter({ ...filter, page: 1, limit: +value })} />
          <PaginationInfo amount={meta?.paging?.totalItems} text={t('category_records')} />
        </div>
        <Pagination
          totalItems={meta?.paging?.totalItems || 0}
          currentPage={meta?.paging?.currentPage}
          itemPerPage={meta?.paging?.itemsPerPage}
          onChange={page => setFilter({ ...filter, page })}
        />
      </div>
      <ModalConfirm
        visible={action.name === CATEGORY_ACTION.DELETE}
        title={t('delete')}
        message={
          <>
            <span>{t('category_delete_message')}</span>
            <strong className="space-x-1">{action.data?.nameLocalized.find(x => x.lang === locale)?.value}</strong>
          </>
        }
        onYes={() => {
          destroyMutation(action.data?.id as string, {
            onSuccess: onDeleteSuccess,
            onError: onDeleteFailure,
          });
          setAction({ name: '' });
        }}
        onNo={() => setAction({ name: '' })}
      />
      <ModalConfirm
        visible={action.name === CATEGORY_ACTION.BULK_DELETE}
        title={t('bulk_delete')}
        message={<span>{t('category_bulk_delete_message')}</span>}
        onYes={() => {
          bulkDestroyMutation(selected, {
            onSuccess: onBulkDeleteSuccess,
            onError: onBulkDeleteFailure,
          });
          setAction({ name: '' });
        }}
        onNo={() => setAction({ name: '' })}
      />
      <CategoryDetailModal id={viewDetailId} visible={!!viewDetailId} onCancel={() => setViewDetailId('')} />
    </div>
  );
};

export default CategoryList;
