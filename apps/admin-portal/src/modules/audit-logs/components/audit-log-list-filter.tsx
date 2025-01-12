import { FC } from 'react';
import classNames from 'classnames';
import { useTranslations } from 'use-intl';
import { Button } from '@repo/react-web-ui-shadcn/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/react-web-ui-shadcn/components/ui/select';

import { ComponentBaseProps } from '@/interfaces/component.interface';
import { AuditLogFilter } from '../interfaces/audit-logs.interface';

import { AUDIT_LOG_DEFAULT_FILTER, AUDIT_LOG_HTTP_METHOD, AUDIT_LOG_TABLE_NAME } from '../constants/audit-logs.constant';

import SearchBox from '@/components/search-box';

type AuditLogListFilterProps = {
  filter: AuditLogFilter;
  setFilter: (filter: AuditLogFilter) => void;
} & ComponentBaseProps;

const AuditLogListFilter: FC<AuditLogListFilterProps> = ({ className, filter, setFilter }) => {
  const t = useTranslations();

  return (
    <div className={classNames('flex w-full gap-x-3', className)}>
      <SearchBox className="w-full" value={filter.email} placeholder="Email" onSearch={value => setFilter({ ...filter, email: value })} />
      <SearchBox
        className="w-full"
        value={filter.recordId}
        placeholder={t('audit_log_record_id')}
        onSearch={value => setFilter({ ...filter, recordId: value })}
      />
      <Select
        value={filter.tableName}
        onValueChange={value => {
          const val = value === 'root' ? undefined : value;

          setFilter({ ...filter, tableName: val });
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder={t('audit_log_table_name')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="root">None</SelectItem>
          {Object.values(AUDIT_LOG_TABLE_NAME).map(item => (
            <SelectItem key={item} value={`${item}`}>
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={filter.action}
        onValueChange={value => {
          const val = value === 'root' ? undefined : value;

          setFilter({ ...filter, action: val });
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder={t('audit_log_action')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="root">None</SelectItem>
          {Object.values(AUDIT_LOG_HTTP_METHOD).map(item => (
            <SelectItem key={item} value={`${item}`}>
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button variant="outline" onClick={() => setFilter(AUDIT_LOG_DEFAULT_FILTER)}>
        {t('filter_reset')}
      </Button>
    </div>
  );
};

export default AuditLogListFilter;
