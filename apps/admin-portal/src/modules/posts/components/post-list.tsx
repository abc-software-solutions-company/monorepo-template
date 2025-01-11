import { FC, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
import { PostEntity, PostFilter } from '../interfaces/posts.interface';

import { POST_ACTION, POST_DEFAULT_FILTER, POST_STATUSES } from '../constants/posts.constant';

import { DataTable } from '@/components/data-table/data-table';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import DataTableRowAction from '@/components/data-table/data-table-row-action';
import ItemsPerPage from '@/components/item-per-page';
import PaginationInfo from '@/components/pagination-info';

import PostDialogDetail from './post-dialog-detail';
import PostListToolbar from './post-list-toolbar';
import PostRowStatus from './post-row-status';

import { usePostsState } from '../states/posts.state';

const PostList: FC<ComponentBaseProps> = ({ className }) => {
  const t = useTranslations();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const locale = useLocale();
  const postsState = usePostsState();
  const [viewDetailId, setViewDetailId] = useState('');
  const [action, setAction] = useState<{ name: string; data?: PostEntity }>({ name: '' });
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const { items, filter, meta, fetchedAt, filteredAt, deletedAt, isFetching, selected, selectSingle, selectAll } = postsState;
  const selectedIds = selected.reduce((row, id) => ({ ...row, [id]: true }), {});

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
              selectAll(value ? items.map(x => x.id) : []);
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
              selectSingle(row.original.id);
            }}
          />
        ),
      },
      {
        accessorKey: 'name',
        size: 0,
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('post_title')} />,
        cell: ({ row }) => {
          return (
            <div className="flex items-center">
              <button
                className="text-left hover:underline"
                onClick={() =>
                  navigate({
                    pathname: `/${locale}/posts/${row.original.id}/edit`,
                    search: `?${objectToQueryString({ sidebar: searchParams.get('sidebar') })}`,
                  })
                }
              >
                {row.getValue('name')}
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

          return <p>{category?.name}</p>;
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
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
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

  const getFilter = (): PostFilter => {
    return {
      q: searchParams.get('q') || POST_DEFAULT_FILTER.q,
      page: parseInt(searchParams.get('page') as string) || POST_DEFAULT_FILTER.page,
      limit: parseInt(searchParams.get('limit') as string) || POST_DEFAULT_FILTER.limit,
      order: searchParams.get('order') || POST_DEFAULT_FILTER.order,
      status: searchParams.getAll('status') || POST_DEFAULT_FILTER.status,
    };
  };

  useEffect(() => {
    const currentFilter = getFilter();

    if (filter) {
      const queryString = objectToQueryString({ ...filter, sidebar: searchParams.get('sidebar') });

      navigate({
        pathname: `/${locale}/posts`,
        search: `?${queryString}`,
      });

      postsState.listRequest({ filter });
    } else {
      postsState.setFilter(currentFilter);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredAt]);

  useEffect(() => {
    if (postsState.deletedAt) table.resetRowSelection(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deletedAt]);

  return (
    <div className={classNames('posts-list flex grow flex-col rounded-lg border bg-card p-4 text-card-foreground shadow-sm', className)}>
      <div className="relative flex h-full grow flex-col">
        <PostListToolbar table={table} onBulkDelete={() => setAction({ name: POST_ACTION.BULK_DELETE })} />
        <DataTable containerClassName="mt-4" table={table} columns={columns} isFetching={isFetching || !fetchedAt} />
      </div>
      <div className="mt-3 flex justify-between">
        <div className="flex items-center space-x-2">
          <ItemsPerPage limit={filter?.limit} onFilter={value => postsState.setFilter({ page: 1, limit: +value })} />
          <PaginationInfo amount={meta?.paging?.totalItems} text={t('post_records')} />
        </div>
        <Pagination
          totalItems={meta?.paging?.totalItems || 0}
          currentPage={meta?.paging?.currentPage}
          itemPerPage={meta?.paging?.itemsPerPage}
          onChange={page => postsState.setFilter({ page })}
        />
      </div>
      <ModalConfirm
        visible={action.name === POST_ACTION.DELETE}
        title={t('delete')}
        content={
          <>
            <span>{t('post_delete_message')}</span>
            <strong className="ml-1">{action.data?.name}?</strong>
          </>
        }
        onYes={() => {
          postsState.destroyRequest(action.data?.id as string);
          setAction({ name: '' });
        }}
        onNo={() => setAction({ name: '' })}
      />
      <ModalConfirm
        visible={action.name === POST_ACTION.BULK_DELETE}
        title={t('bulk_delete')}
        content={<span>{t('post_bulk_delete_message')}</span>}
        onYes={() => {
          postsState.bulkDestroyRequest({ ids: postsState.selected });
          setAction({ name: '' });
        }}
        onNo={() => setAction({ name: '' })}
      />
      <PostDialogDetail id={viewDetailId} visible={!!viewDetailId} onCancel={() => setViewDetailId('')} />
    </div>
  );
};

export default PostList;
