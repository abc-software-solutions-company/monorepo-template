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

  const highlightExactDiff = (oldValue: string, newValue: string) => {
    const oldChars = oldValue.split('');
    const newChars = newValue.split('');
    const result: JSX.Element[] = [];
    let isHighlighting = false;
    let currentGroup = '';

    for (let i = 0; i < Math.max(oldChars.length, newChars.length); i++) {
      const newChar = newChars[i] ?? '';
      const oldChar = oldChars[i] ?? '';

      if (newChar !== oldChar) {
        if (!isHighlighting) {
          if (currentGroup) {
            result.push(<span key={`normal-${i}`}>{currentGroup}</span>);
            currentGroup = '';
          }
          isHighlighting = true;
        }
        currentGroup += newChar;
      } else {
        if (isHighlighting) {
          result.push(
            <span key={`highlight-${i}`} className="rounded-sm bg-amber-200 px-0.5 text-black">
              {currentGroup}
            </span>
          );
          currentGroup = '';
          isHighlighting = false;
        }
        currentGroup += newChar;
      }
    }

    // Handle any remaining characters
    if (currentGroup) {
      result.push(
        isHighlighting ? (
          <span key="highlight-end" className="rounded-sm bg-amber-300 px-0.5 text-black">
            {currentGroup}
          </span>
        ) : (
          <span key="normal-end">{currentGroup}</span>
        )
      );
    }

    return result;
  };

  const renderJsonDiff = (oldValue: unknown, newValue: unknown, showOld: boolean) => {
    if (typeof oldValue === 'object' && typeof newValue === 'object') {
      const filteredChanges = filterChangedFields(oldValue as Record<string, unknown>, newValue as Record<string, unknown>);

      return (
        <div>
          {Object.entries(filteredChanges).map(([key, values]) => (
            <p key={key}>
              {showOld ? (
                <span className="rounded-sm bg-red-200 px-0.5 text-black">{JSON.stringify(values.oldValue, null, 2)}</span>
              ) : (
                <span className="rounded-sm bg-green-200 px-0.5 text-black">
                  {highlightExactDiff(JSON.stringify(values.oldValue ?? '', null, 2), JSON.stringify(values.newValue ?? '', null, 2))}
                </span>
              )}
            </p>
          ))}
        </div>
      );
    }

    return (
      <span className={showOld ? 'rounded-sm bg-red-200 px-0.5 text-black' : 'rounded-sm bg-green-200 px-0.5 text-black'}>
        {showOld ? String(oldValue) : highlightExactDiff(String(oldValue ?? ''), String(newValue ?? ''))}
      </span>
    );
  };

  const filterChangedFields = (
    oldValue: Record<string, unknown>,
    newValue: Record<string, unknown>
  ): Record<string, { oldValue: unknown; newValue: unknown }> => {
    const allKeys = Array.from(new Set([...Object.keys(oldValue || {}), ...Object.keys(newValue || {})]));

    return allKeys.reduce<Record<string, { oldValue: unknown; newValue: unknown }>>((acc, key) => {
      const oldSubValue = oldValue[key];
      const newSubValue = newValue[key];

      if (JSON.stringify(oldSubValue) !== JSON.stringify(newSubValue)) {
        acc[key] = { oldValue: oldSubValue, newValue: newSubValue };
      }

      return acc;
    }, {});
  };

  const fields = useMemo(() => {
    const baseFields = Object.keys({ ...oldData, ...newData });

    return baseFields.filter(field => {
      const oldValue = getNestedValue(oldData, field);
      const newValue = getNestedValue(newData, field);

      return JSON.stringify(oldValue) !== JSON.stringify(newValue);
    });
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
                    <div className="break-all">{renderJsonDiff(oldValue, newValue, true)}</div>
                  </TableCell>
                  <TableCell className="w-1/2 p-2">
                    <div className="break-all">{renderJsonDiff(oldValue, newValue, false)}</div>
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
