import React, { useMemo } from 'react';
import { useTranslations } from 'use-intl';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~react-web-ui-shadcn/components/ui/table';

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

  const fields = useMemo(() => {
    const baseFields = Object.keys({ ...oldData, ...newData }).filter(key => key !== 'seoMeta');
    const seoMetaFields = Object.keys({
      ...((oldData.seoMeta as Record<string, unknown>) || {}),
      ...((newData.seoMeta as Record<string, unknown>) || {}),
    }).map(key => `seoMeta.${key}`);

    const allFields = [...baseFields, ...seoMetaFields];

    // Only return fields that have different values
    return allFields.filter(field => {
      const oldValue = getNestedValue(oldData, field);
      const newValue = getNestedValue(newData, field);

      return String(oldValue ?? '') !== String(newValue ?? '');
    });
  }, [oldData, newData]);

  const highlightDifference = (oldValue: unknown, newValue: unknown, isOld: boolean) => {
    const oldStr = String(oldValue ?? '');
    const newStr = String(newValue ?? '');

    if (oldStr === newStr) return oldStr;

    const words1 = oldStr.split(' ');
    const words2 = newStr.split(' ');
    const result: (string | JSX.Element)[] = [];
    let diffStart = -1;

    for (let i = 0; i < Math.max(words1.length, words2.length); i++) {
      const word1 = words1[i] || '';
      const word2 = words2[i] || '';

      if (word1 !== word2) {
        if (diffStart === -1) diffStart = i;
      } else {
        if (diffStart !== -1) {
          const diffWords = (isOld ? words1 : words2).slice(diffStart, i).join(' ');
          const className = isOld ? 'bg-red-200 text-black' : 'bg-green-200 text-black';

          result.push(
            <span key={diffStart} className={className}>
              {diffWords}
            </span>
          );
          diffStart = -1;
        }
        result.push(word1, ' ');
      }
    }

    if (diffStart !== -1) {
      const diffWords = (isOld ? words1 : words2).slice(diffStart).join(' ');
      const className = isOld ? 'bg-red-200 text-black' : 'bg-green-200 text-black';

      result.push(
        <span key={diffStart} className={className}>
          {diffWords}
        </span>
      );
    }

    return result;
  };

  const formatValue = (value: unknown): string => {
    if (value === null || value === undefined) return '';
    if (Array.isArray(value)) return JSON.stringify(value);
    if (typeof value === 'object') return JSON.stringify(value);

    return String(value);
  };

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
                    <div className="break-all">{highlightDifference(formatValue(oldValue), formatValue(newValue), true)}</div>
                  </TableCell>
                  <TableCell className="w-1/2 p-2">
                    <div className="break-all">{highlightDifference(formatValue(oldValue), formatValue(newValue), false)}</div>
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
