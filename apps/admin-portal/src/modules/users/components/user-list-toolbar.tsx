import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLocale, useTranslations } from 'use-intl';
import { Button } from '@repo/react-web-ui-shadcn/components/ui/button';
import { objectToQueryString } from '@repo/shared-universal/utils/string.util';
import { Table } from '@tanstack/react-table';

import { USER_DEFAULT_FILTER } from '../constants/users.constant';

import { DataTableViewOptions } from '@/components/data-table/data-table-view-options';
import DropdownBulkActions from '@/components/dropdown-bulk-actions';
import SearchBox from '@/components/search-box';

import UserFilters from './user-filters';

import { useUsersState } from '../states/users.state';

type UserListToolbarProps<TData> = {
  table: Table<TData>;
  onBulkDelete?: () => void;
};

export default function UserListToolbar<TData>({ table, onBulkDelete }: UserListToolbarProps<TData>) {
  const t = useTranslations();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const locale = useLocale();
  const usersState = useUsersState();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <UserFilters />
        <SearchBox value={usersState.filter?.q} onSearch={text => usersState.setFilter({ q: text })} />
        <Button variant="outline" onClick={() => usersState.setFilter(USER_DEFAULT_FILTER)}>
          {t('filter_reset')}
        </Button>
        <DataTableViewOptions table={table} />
      </div>
      <div className="flex items-center space-x-2">
        <Button
          onClick={() =>
            navigate({
              pathname: `/${locale}/users/new`,
              search: `?${objectToQueryString({ sidebar: searchParams.get('sidebar') })}`,
            })
          }
        >
          {t('add_new')}
        </Button>
        <DropdownBulkActions
          actions={[
            {
              label: t('bulk_actions_delete_selected_rows'),
              disabled: !usersState.selected.length,
              onClick: onBulkDelete,
            },
          ]}
          dropdownLabel={t('bulk_actions')}
        />
      </div>
    </div>
  );
}
