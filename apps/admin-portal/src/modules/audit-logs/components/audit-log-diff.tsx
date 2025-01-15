import React, { useMemo } from 'react';
import { useTranslations } from 'use-intl';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@repo/react-web-ui-shadcn/components/ui/table';

type AuditLogDiffProps = {
  oldData: Record<string, unknown>;
  newData: Record<string, unknown>;
};

const AuditLogDiff: React.FC<AuditLogDiffProps> = ({ oldData, newData }) => {
  const t = useTranslations();

  const getNestedValue = (data: Record<string, unknown>, path: string): unknown => {
    const parts = path.split('.');
    let value: unknown = data;

    for (const part of parts) {
      value = (value as Record<string, unknown>)?.[part];
    }

    return value;
  };

  const renderValue = (value: unknown) => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        return JSON.stringify(value, null, 2);
      }

      return JSON.stringify(value);
    }

    return String(value);
  };

  const fields = useMemo(() => {
    const result: string[] = [];
    const baseFields = Object.keys({ ...oldData, ...newData });

    baseFields.forEach(field => {
      const oldValue = getNestedValue(oldData, field);
      const newValue = getNestedValue(newData, field);

      if (
        (typeof oldValue === 'object' && oldValue !== null && !Array.isArray(oldValue)) ||
        (typeof newValue === 'object' && newValue !== null && !Array.isArray(newValue))
      ) {
        const oldObj = (oldValue as Record<string, unknown>) || {};
        const newObj = (newValue as Record<string, unknown>) || {};
        const allKeys = new Set([...Object.keys(oldObj), ...Object.keys(newObj)]);

        allKeys.forEach(key => {
          if (JSON.stringify(oldObj[key]) !== JSON.stringify(newObj[key])) {
            result.push(`${field}.${key}`);
          }
        });
      } else if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        result.push(field);
      }
    });

    return result;
  }, [oldData, newData]);

  return (
    <div className="scrollbar overflow-auto rounded border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="p-2 text-left">
              <strong>{t('audit_logs_field')}</strong>
            </TableHead>
            <TableHead className="p-2 text-left">
              <strong>{t('audit_logs_previous')}</strong>
            </TableHead>
            <TableHead className="p-2 text-left">
              <strong>{t('audit_logs_current')}</strong>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fields.length > 0 ? (
            fields.map(field => {
              const oldValue = getNestedValue(oldData, field);
              const newValue = getNestedValue(newData, field);

              return (
                <TableRow key={field}>
                  <TableCell className="w-40">
                    <strong>{field}</strong>
                  </TableCell>
                  <TableCell className="w-1/2 p-2">
                    <div className="break-all">
                      <span className="rounded-sm bg-red-200 text-black">{renderValue(oldValue)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="w-1/2 p-2">
                    <div className="break-all">
                      <span className="rounded-sm bg-green-200 text-black">{renderValue(newValue)}</span>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="py-4 text-center">
                {t('no_changes_found')}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AuditLogDiff;
