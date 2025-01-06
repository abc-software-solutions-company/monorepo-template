import classNames from 'classnames';
import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { useTranslations } from 'use-intl';
import { Card, CardContent, CardHeader, CardTitle } from '~react-web-ui-shadcn/components/ui/card';
import { FormControl, FormField, FormItem, FormMessage } from '~react-web-ui-shadcn/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~react-web-ui-shadcn/components/ui/select';

import { OptionType } from '@/interfaces/status.interface';

type FormFieldCardSelectCategoryTypeProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  formLabel?: string;
  fieldName?: Path<T>;
  items: OptionType[];
  onChange?: (value: string) => void;
};

export default function FormFieldCardSelectCategoryType<T extends FieldValues>({
  form,
  formLabel,
  items,
  fieldName = 'type' as Path<T>,
  onChange,
}: FormFieldCardSelectCategoryTypeProps<T>) {
  const t = useTranslations();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{formLabel ?? t('form_field_category_type')}</CardTitle>
      </CardHeader>
      <CardContent>
        <FormField
          control={form.control}
          name={fieldName}
          render={({ field, fieldState: { error } }) => (
            <FormItem>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={value => {
                    field.onChange(value);
                    onChange?.(value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {items?.map(item => {
                      return (
                        <SelectItem key={item.value} value={item.value}>
                          <div className="flex items-center">
                            {item.icon && <item.icon className={classNames('mr-2 h-4 w-4', item.iconClassName)} />}
                            <span>{item.label}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </FormControl>
              {error?.message && <FormMessage message={t(error.message)} />}
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
