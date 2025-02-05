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
import { UserEntity, UserFilter } from '../interfaces/users.interface';

import { USER_ACTION, USER_DEFAULT_FILTER, USER_STATUSES } from '../constants/users.constant';

import { DataTable } from '@/components/data-table/data-table';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import DataTableRowAction from '@/components/data-table/data-table-row-action';
import ItemsPerPage from '@/components/item-per-page';
import PaginationInfo from '@/components/pagination-info';

import countries from '@/assets/country-list.json';

import UserListToolbar from './user-list-toolbar';
import UserRowStatus from './user-row-status';

import { useUsersState } from '../states/users.state';

const UserList: FC<ComponentBaseProps> = ({ className }) => {
  const t = useTranslations();
  const navigate = useNavigate();
  const locale = useLocale();
  const [searchParams] = useSearchParams();
  const usersState = useUsersState();
  const [action, setAction] = useState<{ name: string; data?: UserEntity }>({ name: '' });
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const { items, filter, meta, fetchedAt, filteredAt, deletedAt, isFetching, selected, selectSingle, selectAll } = usersState;
  const selectedIds = selected.reduce((row, id) => ({ ...row, [id]: true }), {});

  const [rowSelection, setRowSelection] = useState<RowSelectionState>(selectedIds);
  const columns: ColumnDef<UserEntity>[] = useMemo(
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
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('user_name')} />,
        cell: ({ row }) => {
          return (
            <div className="flex items-center space-x-1">
              <button
                className="text-left hover:underline"
                onClick={() =>
                  navigate({
                    pathname: `/${locale}/users/${row.original.id}/edit`,
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
        accessorKey: 'country',
        size: 0,
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('user_country')} />,
        cell: ({ row }) => {
          const country = countries.find(x => x.code === row.getValue('country'));

          if (!country) return null;

          return <p>{country.name}</p>;
        },
      },
      {
        accessorKey: 'email',
        size: 0,
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('user_email')} />,
        cell: ({ row }) => {
          return <p>{row.getValue('email')}</p>;
        },
      },
      {
        accessorKey: 'phoneNumber',
        size: 0,
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('user_phone')} />,
        cell: ({ row }) => {
          return <p>{row.getValue('phoneNumber')}</p>;
        },
      },
      {
        accessorKey: 'createdAt',
        size: 0,
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('user_created_at')} />,
        cell: ({ row }) => {
          const date = new Date(row.getValue('createdAt'));

          return <p className="text-sm text-muted-foreground">{toDateTime(date, locale)}</p>;
        },
      },
      {
        accessorKey: 'status',
        size: 0,
        header: ({ column }) => <DataTableColumnHeader className="text-center" column={column} title={t('user_status')} />,
        cell: ({ row }) => {
          const status = USER_STATUSES.find(x => x.value === row.getValue('status'));

          if (!status) return null;

          return (
            <div className="text-center">
              <UserRowStatus status={status} />
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
            <strong>{t('user_actions')}</strong>
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center justify-center">
            <DataTableRowAction
              items={[
                { label: t('user_delete'), action: USER_ACTION.DELETE },
                { label: t('user_auditlog'), action: USER_ACTION.AUDIT_LOG },
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

  const getFilter = (): UserFilter => {
    return {
      q: searchParams.get('q') || USER_DEFAULT_FILTER.q,
      page: parseInt(searchParams.get('page') as string) || USER_DEFAULT_FILTER.page,
      limit: parseInt(searchParams.get('limit') as string) || USER_DEFAULT_FILTER.limit,
      order: searchParams.get('order') || USER_DEFAULT_FILTER.order,
      status: searchParams.getAll('status') || USER_DEFAULT_FILTER.status,
    };
  };

  useEffect(() => {
    const currentFilter = getFilter();

    if (filter) {
      const queryString = objectToQueryString({ ...filter, sidebar: searchParams.get('sidebar') });

      navigate({
        pathname: `/${locale}/users`,
        search: `?${queryString}`,
      });

      usersState.listRequest({ filter });
    } else {
      usersState.setFilter(currentFilter);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredAt]);

  useEffect(() => {
    if (usersState.deletedAt) table.resetRowSelection(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deletedAt]);

  return (
    <div className={classNames('users-list flex grow flex-col rounded-lg border bg-card p-4 text-card-foreground shadow-sm', className)}>
      <div className="relative flex h-full grow flex-col">
        <UserListToolbar table={table} onBulkDelete={() => setAction({ name: USER_ACTION.BULK_DELETE })} />
        <DataTable containerClassName="mt-4" table={table} columns={columns} isFetching={isFetching || !fetchedAt} />
      </div>
      <div className="mt-3 flex justify-between">
        <div className="flex items-center space-x-2">
          <ItemsPerPage limit={filter?.limit} onFilter={value => usersState.setFilter({ page: 1, limit: +value })} />
          <PaginationInfo amount={meta?.paging?.totalItems} text={t('user_records')} />
        </div>
        <Pagination
          totalItems={meta?.paging?.totalItems || 0}
          currentPage={meta?.paging?.currentPage}
          itemPerPage={meta?.paging?.itemsPerPage}
          onChange={page => usersState.setFilter({ page })}
        />
      </div>
      <ModalConfirm
        visible={action.name === USER_ACTION.DELETE}
        title={t('delete')}
        message={
          <>
            <span>{t('user_delete_message')}</span>
            <strong className="ml-1">{action.data?.name}?</strong>
          </>
        }
        onYes={() => {
          usersState.destroyRequest(action.data?.id as string);
          setAction({ name: '' });
        }}
        onNo={() => setAction({ name: '' })}
      />
      <ModalConfirm
        visible={action.name === USER_ACTION.BULK_DELETE}
        title={t('bulk_delete')}
        message={<span>{t('user_bulk_delete_message')}</span>}
        onYes={() => {
          usersState.bulkDestroyRequest({ ids: usersState.selected });
          setAction({ name: '' });
        }}
        onNo={() => setAction({ name: '' })}
      />
    </div>
  );
};

export default UserList;
