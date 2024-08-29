import React, { useMemo } from 'react';
import { useTranslations } from 'use-intl';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~react-web-ui-shadcn/components/ui/table';

type AuditLogDiffProps = {
  oldData: Record<string, unknown>;
  newData: Record<string, unknown>;
};

const AuditLogDiff: React.FC<AuditLogDiffProps> = ({ oldData, newData }) => {
  const t = useTranslations();
  const fields = useMemo(() => Object.keys({ ...oldData, ...newData }), [oldData, newData]);

  const highlightDifference = (oldValue: unknown, newValue: unknown, isOld: boolean) => {
    const oldStr = String(oldValue);
    const newStr = String(newValue);

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
          const className = isOld ? 'bg-red-200' : 'bg-green-200';

          result.push(
            <span key={diffStart} className={className}>
              {diffWords}
            </span>,
            ' '
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
          {fields.map(field => (
            <TableRow key={field}>
              <TableCell className="w-40">
                <strong>{field}</strong>
              </TableCell>
              <TableCell className="w-1/2 p-2">{highlightDifference(oldData[field] ?? '', newData[field] ?? '', true)}</TableCell>
              <TableCell className="w-1/2 p-2">{highlightDifference(oldData[field] ?? '', newData[field] ?? '', false)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AuditLogDiff;
