import { Fragment, useMemo } from 'react';
import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { useLocale, useTranslations } from 'use-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/react-web-ui-shadcn/components/ui/card';
import { FormControl, FormField, FormItem, FormMessage } from '@repo/react-web-ui-shadcn/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/react-web-ui-shadcn/components/ui/select';
import { repeatStr } from '@repo/shared-universal/utils/string.util';

import { CategoryEntity } from '@/modules/categories/interfaces/categories.interface';

const renderCategories = (cates: CategoryEntity[], depth = 0, locale?: string) => {
  return cates.map(category => {
    const name = category.nameLocalized.find(x => x.lang === locale)?.value;

    return (
      <Fragment key={category.id}>
        <SelectItem value={category.id}>
          {repeatStr('└', '─', depth)}
          {name}
        </SelectItem>
        {category.children && renderCategories(category.children, depth + 1, locale)}
      </Fragment>
    );
  });
};

type FormFieldCardSelectCategoryProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  formLabel?: string;
  fieldName?: Path<T>;
  items: CategoryEntity[];
  visibled?: boolean;
  onChange?: (value?: string) => void;
};

export default function FormFieldCardSelectCategory<T extends FieldValues>({
  form,
  formLabel,
  items,
  fieldName = 'categoryId' as Path<T>,
  visibled = true,
  onChange,
}: FormFieldCardSelectCategoryProps<T>) {
  const t = useTranslations();
  const locale = useLocale();
  const memoizedCategories = useMemo(() => renderCategories(items, 0, locale), [items, locale]);

  if (!visibled) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{formLabel}</CardTitle>
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
                    const val = value === 'root' ? '' : value;

                    field.onChange(val);
                    onChange?.(val);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="root">Root</SelectItem>
                    {memoizedCategories}
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
