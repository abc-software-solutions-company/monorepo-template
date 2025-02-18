import { FC, useEffect, useMemo, useState } from 'react';
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
import { ProductEntity, ProductResponse, ProductsResponse } from '../interfaces/products.interface';

import { IMAGE_THUMBNAIL_URL } from '@/constants/file.constant';
import { PRODUCT_ACTION, PRODUCT_STATUS, PRODUCT_STATUSES, PRODUCT_TYPE, QUERY_PRODUCT_LIST } from '../constants/products.constant';

import { useBulkDestroyProductsMutation, useDestroyProductMutation } from '../hooks/use-product-queries';
import { useProducts } from '../hooks/use-products';

import { DataTable } from '@/components/data-table/data-table';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import DataTableRowAction from '@/components/data-table/data-table-row-action';
import ItemsPerPage from '@/components/item-per-page';
import PaginationInfo from '@/components/pagination-info';

import { getQueryClient } from '@/utils/query-client.util';

import ProductDetailModal from './product-detail-modal';
import ProductListToolbar from './product-list-toolbar';
import ProductRowStatus from './product-row-status';

const queryClient = getQueryClient();

const ProductList: FC<ComponentBaseProps> = ({ className }) => {
  const t = useTranslations();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const locale = useLocale();
  const [viewDetailId, setViewDetailId] = useState('');
  const [action, setAction] = useState<{ name: string; data?: ProductEntity }>({ name: '' });
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const { items, meta, selected, selectedIds, isFetching, filter, setFilter, toggleSelect, toggleSelectAll, clearSelection } = useProducts();
  const { mutateAsync: destroyMutation } = useDestroyProductMutation();
  const { mutateAsync: bulkDestroyMutation } = useBulkDestroyProductsMutation();
  const [rowSelection, setRowSelection] = useState<RowSelectionState>(selectedIds);
  const columns: ColumnDef<ProductEntity>[] = useMemo(
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
        accessorKey: 'coverLocalized',
        size: 130,
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('product_image')} />,
        cell: ({ row }) => {
          const name = row.original.nameLocalized?.find(x => x.lang === locale)?.value;
          const cover = row.original.coverLocalized?.find(x => x.lang === locale)?.value;

          if (!cover) return null;

          return <img className="h-16 w-24 rounded-md object-cover" src={IMAGE_THUMBNAIL_URL + cover} alt={name} />;
        },
      },
      {
        accessorKey: 'name',
        size: 0,
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('product_title')} />,
        cell: ({ row }) => {
          const name = row.original.nameLocalized?.find(x => x.lang === locale)?.value ?? '';
          const fallbackName = row.original.nameLocalized?.[0]?.value ?? '';

          return (
            <div className="flex items-center">
              <button
                className="text-left hover:underline"
                onClick={() =>
                  navigate({
                    pathname: `/${locale}/products/${row.original.id}/edit`,
                    search: `?${objectToQueryString({ sidebar: searchParams.get('sidebar'), type: searchParams.get('type') })}`,
                  })
                }
              >
                {name || fallbackName}
              </button>
              <button className="p-1.5" onClick={() => setViewDetailId(row.original.id)}>
                <span className="text-primary">({t('view_detail')})</span>
              </button>
            </div>
          );
        },
      },
      {
        accessorKey: 'category',
        size: 0,
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('product_category')} />,
        cell: ({ row }) => {
          const name = row.original.category.nameLocalized.find(x => x.lang === locale)?.value;

          return <p>{name}</p>;
        },
      },
      {
        accessorKey: 'createdAt',
        size: 0,
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('product_created_at')} />,
        cell: ({ row }) => {
          const date = new Date(row.getValue('createdAt'));

          return <p className="text-sm text-muted-foreground">{toDateTime(date, locale)}</p>;
        },
      },
      {
        accessorKey: 'status',
        size: 0,
        header: ({ column }) => <DataTableColumnHeader className="text-center" column={column} title={t('product_status')} />,
        cell: ({ row }) => {
          const status = PRODUCT_STATUSES.find(x => x.value === row.getValue('status'));

          if (!status) return null;

          return (
            <div className="text-center">
              <ProductRowStatus status={status} />
            </div>
          );
        },
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
      },
      {
        accessorKey: 'creator',
        size: 0,
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('product_author')} />,
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
            <strong>{t('product_actions')}</strong>
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center justify-center">
            <DataTableRowAction
              items={[
                { label: t('product_delete'), action: PRODUCT_ACTION.DELETE },
                {
                  label: t('product_auditlog'),
                  action: PRODUCT_ACTION.AUDIT_LOG,
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

  const onDeleteSuccess = async (resp: ProductResponse, id: string) => {
    queryClient.setQueryData<ProductsResponse>([QUERY_PRODUCT_LIST, filter], cached => {
      if (!cached || !cached.data) return cached;

      const updatedData = cached.data.map(item => (item.id === id ? { ...item, status: PRODUCT_STATUS.DELETED } : item));

      return { ...cached, data: updatedData };
    });

    toast(t('product_delete_toast_title'), { description: t('product_delete_success') });
  };

  const onDeleteFailure = (error: Error, _id: string) => {
    let errorMessage = t('product_delete_failure');

    if (axios.isAxiosError(error) && error.response) {
      errorMessage += `\n${error.response.data.message}`;
    } else {
      errorMessage += `\n${error.message}`;
    }

    toast(t('product_delete_toast_title'), { description: errorMessage });
  };

  const onBulkDeleteSuccess = (_resp: ProductsResponse, ids: string[]) => {
    queryClient.setQueryData<ProductsResponse>([QUERY_PRODUCT_LIST, filter], cached => {
      if (!cached || !cached.data) return cached;

      const updatedData = cached.data.map(item => (ids.includes(item.id) ? { ...item, status: PRODUCT_STATUS.DELETED } : item));

      return { ...cached, data: updatedData };
    });

    table.resetRowSelection(false);
    clearSelection();
    toast(t('product_delete_toast_title'), { description: t('product_delete_success') });
  };

  const onBulkDeleteFailure = (error: Error) => {
    let errorMessage = t('product_bulk_delete_failure');

    if (axios.isAxiosError(error) && error.response) {
      errorMessage += `\n${error.response.data.message}`;
    } else {
      errorMessage += `\n${error.message}`;
    }

    toast(t('product_delete_toast_title'), { description: errorMessage });
  };

  useEffect(() => {
    setFilter({ ...filter, type: searchParams.get('type') as PRODUCT_TYPE });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <div className={classNames('products-list flex grow flex-col rounded-lg border bg-card p-4 text-card-foreground shadow-sm', className)}>
      <div className="relative flex h-full grow flex-col">
        <ProductListToolbar table={table} onBulkDelete={() => setAction({ name: PRODUCT_ACTION.BULK_DELETE })} />
        <DataTable containerClassName="mt-4" table={table} columns={columns} isFetching={isFetching} />
      </div>
      <div className="mt-3 flex justify-between">
        <div className="flex items-center space-x-2">
          <ItemsPerPage limit={filter?.limit} onFilter={value => setFilter({ ...filter, page: 1, limit: +value })} />
          <PaginationInfo amount={meta?.paging?.totalItems} text={t('product_records')} />
        </div>
        <Pagination
          totalItems={meta?.paging?.totalItems || 0}
          currentPage={meta?.paging?.currentPage}
          itemPerPage={meta?.paging?.itemsPerPage}
          onChange={page => setFilter({ ...filter, page })}
        />
      </div>
      <ModalConfirm
        visible={action.name === PRODUCT_ACTION.DELETE}
        title={t('delete')}
        message={
          <>
            <span>{t('product_delete_message')}</span>
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
        visible={action.name === PRODUCT_ACTION.BULK_DELETE}
        title={t('bulk_delete')}
        message={<span>{t('product_bulk_delete_message')}</span>}
        onYes={() => {
          bulkDestroyMutation(selected, {
            onSuccess: onBulkDeleteSuccess,
            onError: onBulkDeleteFailure,
          });
          setAction({ name: '' });
        }}
        onNo={() => setAction({ name: '' })}
      />
      <ProductDetailModal id={viewDetailId} visible={!!viewDetailId} onCancel={() => setViewDetailId('')} />
    </div>
  );
};

export default ProductList;
