import { FC, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { EyeIcon } from 'lucide-react';
import { useLocale, useTranslations } from 'use-intl';
import { Button } from '@repo/react-web-ui-shadcn/components/ui/button';
import Pagination from '@repo/react-web-ui-shadcn/components/ui/pagination-custom';
import { toDateTime } from '@repo/shared-universal/utils/date.util';
import { ColumnDef, getCoreRowModel, useReactTable } from '@tanstack/react-table';

import { ComponentBaseProps } from '@/interfaces/component.interface';
import { ContactEntity } from '../interfaces/contacts.interface';

import { useContacts } from '../hooks/use-contacts';

import { DataTable } from '@/components/data-table/data-table';
import ItemsPerPage from '@/components/item-per-page';
import PaginationInfo from '@/components/pagination-info';

import ContactDetailModal from './contact-detail-modal';
import ContactListFilter from './contact-list-filter';

type ContactListProps = {
  items?: ContactEntity[];
} & ComponentBaseProps;

export const ContactList: FC<ContactListProps> = ({ className }) => {
  const t = useTranslations();
  const locale = useLocale();
  const { items, meta, filter, isFetching, setFilter } = useContacts();
  const [viewDetailId, setViewDetailId] = useState('');
  const columns: ColumnDef<ContactEntity>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        size: 150,
        header: () => <strong>{t('contact_name')}</strong>,
        cell: ({ row }) => {
          return <span className={!row.original.isRead ? 'font-bold' : ''}>{row.original.name}</span>;
        },
      },
      {
        accessorKey: 'email',
        size: 350,
        header: () => <strong>{t('contact_email')}</strong>,
        cell: ({ row }) => {
          return <span className={!row.original.isRead ? 'font-bold' : ''}>{row.getValue('email')}</span>;
        },
      },
      {
        accessorKey: 'message',
        size: 350,
        header: () => <strong>{t('contact_message')}</strong>,
        cell: ({ row }) => {
          return (
            <div className="flex items-start space-x-3">
              <button className="text-left" onClick={() => setViewDetailId(row.original.id)}>
                <p className={classNames('line-clamp-3', !row.original.isRead ? 'font-bold' : '')}>{row.getValue('message')}</p>
              </button>
            </div>
          );
        },
      },
      {
        accessorKey: 'createdAt',
        size: 200,
        header: () => <strong>{t('contact_created_at')}</strong>,
        cell: ({ row }) => {
          const date = new Date(row.getValue('createdAt'));

          return <p className="text-sm text-muted-foreground">{toDateTime(date, locale)}</p>;
        },
      },
      {
        id: 'actions',
        size: 110,
        header: () => (
          <div className="text-center">
            <strong>{t('contact_actions')}</strong>
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items]
  );
  const table = useReactTable({
    data: items,
    columns,
    enableColumnResizing: false,
    manualPagination: true,
    getRowId: row => row.id.toString(),
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    if (viewDetailId) {
      table.getRow(viewDetailId).original.isRead = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewDetailId]);

  return (
    <div className={classNames('flex grow flex-col rounded-lg border bg-card p-4 text-card-foreground shadow-sm', className)}>
      <div className="relative flex h-full grow flex-col">
        <ContactListFilter filter={filter} setFilter={setFilter} />
        <DataTable
          containerClassName="mt-4"
          table={table}
          columns={columns}
          isFetching={isFetching}
          rowClassName={row => (row.original.isRead ? '' : 'bg-primary/5 text-primary')}
        />
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
      <ContactDetailModal id={viewDetailId} visible={!!viewDetailId} onCancel={() => setViewDetailId('')} />
    </div>
  );
};
