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
import { PostEntity, PostResponse, PostsResponse } from '../interfaces/posts.interface';

import { POST_ACTION, POST_STATUS, POST_STATUSES, POST_TYPE, QUERY_POST_LIST } from '../constants/posts.constant';

import { useBulkDestroyPostsMutation, useDestroyPostMutation, useUpdatePostMutation } from '../hooks/use-post-queries';
import { usePosts } from '../hooks/use-posts';

import { DataTable } from '@/components/data-table/data-table';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import DataTableRowAction from '@/components/data-table/data-table-row-action';
import ItemsPerPage from '@/components/item-per-page';
import PaginationInfo from '@/components/pagination-info';
import QuickEditOrder from '@/components/quick-edit/quick-edit-order';

import { getQueryClient } from '@/utils/query-client.util';

import PostDetailModal from './post-detail-modal';
import PostListToolbar from './post-list-toolbar';
import PostRowStatus from './post-row-status';

const queryClient = getQueryClient();

const PostList: FC<ComponentBaseProps> = ({ className }) => {
  const t = useTranslations();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const locale = useLocale();
  const [viewDetailId, setViewDetailId] = useState('');
  const [action, setAction] = useState<{ name: string; data?: PostEntity }>({ name: '' });
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const { items, meta, selected, selectedIds, isFetching, filter, setFilter, toggleSelect, toggleSelectAll, clearSelection } = usePosts();
  const { mutateAsync: destroyMutation } = useDestroyPostMutation();
  const { mutateAsync: bulkDestroyMutation } = useBulkDestroyPostsMutation();
  const { mutateAsync: updateMutation } = useUpdatePostMutation();
  const [rowSelection, setRowSelection] = useState<RowSelectionState>(selectedIds);

  const columns: ColumnDef<PostEntity>[] = useMemo(
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
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('post_title')} />,
        cell: ({ row }) => {
          const name = row.original.nameLocalized?.find(x => x.lang === locale)?.value ?? '';
          const fallbackName = row.original.nameLocalized?.[0]?.value ?? '';

          return (
            <div className="flex items-center">
              <button
                className="text-left hover:underline"
                onClick={() =>
                  navigate({
                    pathname: `/${locale}/posts/${row.original.id}/edit`,
                    search: `?${objectToQueryString({
                      sidebar: searchParams.get('sidebar'),
                      type: searchParams.get('type'),
                    })}`,
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
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('post_category')} />,
        cell: ({ row }) => {
          const category = row.original.category;
          const cateName = category?.nameLocalized.find(x => x.lang === locale)?.value;

          return <p>{cateName}</p>;
        },
      },
      {
        accessorKey: 'createdAt',
        size: 0,
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('post_created_at')} />,
        cell: ({ row }) => {
          const date = new Date(row.getValue('createdAt'));

          return <p className="text-muted-foreground">{toDateTime(date, locale)}</p>;
        },
      },
      {
        accessorKey: 'status',
        size: 0,
        header: ({ column }) => <DataTableColumnHeader className="text-center" column={column} title={t('post_status')} />,
        cell: ({ row }) => {
          const status = POST_STATUSES.find(x => x.value === row.getValue('status'));

          if (!status) return null;

          return (
            <div className="text-center">
              <PostRowStatus status={status} />
            </div>
          );
        },
      },
      {
        accessorKey: 'order',
        size: 90,
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('table_col_order')} />,
        cell: ({ row }) => {
          return (
            <div className="grid items-center">
              <QuickEditOrder initialValue={row.original.order} onSave={value => handleUpdateOrder(row.original.id, value)} />
            </div>
          );
        },
      },
      {
        accessorKey: 'creator',
        size: 0,
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('post_author')} />,
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
            <strong>{t('post_actions')}</strong>
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center justify-center">
            <DataTableRowAction
              items={[
                { label: t('post_delete'), action: POST_ACTION.DELETE },
                { label: t('post_auditlog'), action: POST_ACTION.AUDIT_LOG },
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

  const handleUpdateOrder = (id: string, order: number) => {
    updateMutation(
      { id, formData: { order } },
      {
        onSuccess: () => {
          toast(t('post_update_toast_title'), { description: t('post_update_success') });
        },
        onError: (error: Error) => {
          let errorMessage = t('post_update_failure');

          if (axios.isAxiosError(error) && error.response) {
            errorMessage += `\n${error.response.data.message}`;
          } else {
            errorMessage += `\n${error.message}`;
          }

          toast(t('post_update_toast_title'), { description: errorMessage });
        },
      }
    );
  };

  const onDeleteSuccess = async (resp: PostResponse, id: string) => {
    queryClient.setQueryData<PostsResponse>([QUERY_POST_LIST, filter], cached => {
      if (!cached || !cached.data) return cached;

      const updatedData = cached.data.map(item => (item.id === id ? { ...item, status: POST_STATUS.DELETED } : item));

      return { ...cached, data: updatedData };
    });

    toast(t('post_delete_toast_title'), { description: t('post_delete_success') });
  };

  const onDeleteFailure = (error: Error, _id: string) => {
    let errorMessage = t('post_delete_failure');

    if (axios.isAxiosError(error) && error.response) {
      errorMessage += `\n${error.response.data.message}`;
    } else {
      errorMessage += `\n${error.message}`;
    }

    toast(t('post_delete_toast_title'), { description: errorMessage });
  };

  const onBulkDeleteSuccess = (_resp: PostsResponse, ids: string[]) => {
    queryClient.setQueryData<PostsResponse>([QUERY_POST_LIST, filter], cached => {
      if (!cached || !cached.data) return cached;

      const updatedData = cached.data.map(item => (ids.includes(item.id) ? { ...item, status: POST_STATUS.DELETED } : item));

      return { ...cached, data: updatedData };
    });

    table.resetRowSelection(false);
    clearSelection();
    toast(t('post_delete_toast_title'), { description: t('post_delete_success') });
  };

  const onBulkDeleteFailure = (error: Error) => {
    let errorMessage = t('post_bulk_delete_failure');

    if (axios.isAxiosError(error) && error.response) {
      errorMessage += `\n${error.response.data.message}`;
    } else {
      errorMessage += `\n${error.message}`;
    }

    toast(t('post_delete_toast_title'), { description: errorMessage });
  };

  useEffect(() => {
    setFilter({ ...filter, type: searchParams.get('type') as POST_TYPE });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <div className={classNames('posts-list flex grow flex-col rounded-lg border bg-card p-4 text-card-foreground shadow-sm', className)}>
      <div className="relative flex h-full grow flex-col">
        <PostListToolbar table={table} onBulkDelete={() => setAction({ name: POST_ACTION.BULK_DELETE })} />
        <DataTable containerClassName="mt-4" table={table} columns={columns} isFetching={isFetching} />
      </div>
      <div className="mt-3 flex justify-between">
        <div className="flex items-center space-x-2">
          <ItemsPerPage limit={filter?.limit} onFilter={value => setFilter({ ...filter, page: 1, limit: +value })} />
          <PaginationInfo amount={meta?.paging?.totalItems} text={t('post_records')} />
        </div>
        <Pagination
          totalItems={meta?.paging?.totalItems || 0}
          currentPage={meta?.paging?.currentPage}
          itemPerPage={meta?.paging?.itemsPerPage}
          onChange={page => setFilter({ ...filter, page })}
        />
      </div>
      <ModalConfirm
        visible={action.name === POST_ACTION.DELETE}
        title={t('delete')}
        message={
          <>
            <span>{t('post_delete_message')}</span>
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
        visible={action.name === POST_ACTION.BULK_DELETE}
        title={t('bulk_delete')}
        message={<span>{t('post_bulk_delete_message')}</span>}
        onYes={() => {
          bulkDestroyMutation(selected, {
            onSuccess: onBulkDeleteSuccess,
            onError: onBulkDeleteFailure,
          });
          setAction({ name: '' });
        }}
        onNo={() => setAction({ name: '' })}
      />
      <PostDetailModal id={viewDetailId} visible={!!viewDetailId} onCancel={() => setViewDetailId('')} />
    </div>
  );
};

export default PostList;
