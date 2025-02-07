import classNames from 'classnames';
import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { useTranslations } from 'use-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/react-web-ui-shadcn/components/ui/card';
import { FormControl, FormField, FormItem, FormMessage } from '@repo/react-web-ui-shadcn/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/react-web-ui-shadcn/components/ui/select';

import { OptionType } from '@/interfaces/status.interface';

type FormFieldCardSelectStatusProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  formLabel?: string;
  fieldName?: Path<T>;
  statuses: OptionType[];
  visibled?: boolean;
};

export default function FormFieldCardSelectStatus<T extends FieldValues>({
  form,
  formLabel,
  statuses,
  visibled = true,
  fieldName = 'status' as Path<T>,
}: FormFieldCardSelectStatusProps<T>) {
  const t = useTranslations();

  if (!visibled) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{formLabel ?? t('form_field_status')}</CardTitle>
      </CardHeader>
      <CardContent>
        <FormField
          control={form.control}
          name={fieldName}
          render={({ field, fieldState: { error } }) => (
            <FormItem>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses?.map(status => {
                      return (
                        <SelectItem key={status.value} value={status.value}>
                          <div className="flex items-center">
                            {status.icon && <status.icon className={classNames('mr-2 h-4 w-4', status.iconClassName)} />}
                            <span>{status.label}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </FormControl>
              {error?.message && <FormMessage message={t(error.message, { min: 1 })} />}
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
