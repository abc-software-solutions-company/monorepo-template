import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLocale, useTranslations } from 'use-intl';
import { Button } from '@repo/react-web-ui-shadcn/components/ui/button';
import { objectToQueryString } from '@repo/shared-universal/utils/string.util';
import { Table } from '@tanstack/react-table';

import { CATEGORY_DEFAULT_FILTER } from '../constants/categories.constant';

import { useCategories } from '../hooks/use-categories';

import { DataTableViewOptions } from '@/components/data-table/data-table-view-options';
import DropdownBulkActions from '@/components/dropdown-bulk-actions';
import SearchBox from '@/components/search-box';

import CategoryFilters from './category-filters';

type CategoryListToolbarProps<TData> = {
  table: Table<TData>;
  onBulkDelete?: () => void;
};

export default function CategoryListToolbar<TData>({ table, onBulkDelete }: CategoryListToolbarProps<TData>) {
  const t = useTranslations();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const locale = useLocale();
  const { selected, filter, setFilter } = useCategories();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <CategoryFilters />
        <SearchBox value={filter?.q} onSearch={text => setFilter({ ...filter, q: text })} />
        <Button variant="outline" onClick={() => setFilter(CATEGORY_DEFAULT_FILTER)}>
          {t('filter_reset')}
        </Button>
        <DataTableViewOptions table={table} />
      </div>
      <div className="flex items-center space-x-2">
        <Button
          onClick={() =>
            navigate({
              pathname: `/${locale}/categories/new`,
              search: `?${objectToQueryString({
                sidebar: searchParams.get('sidebar'),
                type: searchParams.get('type'),
              })}`,
            })
          }
        >
          {t('add_new')}
        </Button>
        <DropdownBulkActions
          actions={[
            {
              label: t('bulk_actions_delete_selected_rows'),
              disabled: !selected.length,
              onClick: onBulkDelete,
            },
          ]}
          dropdownLabel={t('bulk_actions')}
        />
      </div>
    </div>
  );
}
