import { Fragment, useMemo } from 'react';
import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { useTranslations } from 'use-intl';
import { Card, CardContent, CardHeader, CardTitle } from '~react-web-ui-shadcn/components/ui/card';
import { FormControl, FormField, FormItem, FormMessage } from '~react-web-ui-shadcn/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~react-web-ui-shadcn/components/ui/select';
import { repeatStr } from '~shared-universal/utils/string.util';

import { ComponentBaseProps } from '@/interfaces/component.interface';

import { CategoryEntity } from '@/modules/categories/interfaces/categories.interface';

const renderCategories = (cates: CategoryEntity[], depth = 0) => {
  return cates.map(category => (
    <Fragment key={category.id}>
      <SelectItem value={category.id}>
        {repeatStr('└', '─', depth)}
        {category.name}
      </SelectItem>
      {category.children && renderCategories(category.children, depth + 1)}
    </Fragment>
  ));
};

type FormFieldCardSelectCategoryProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  formLabel?: string;
  fieldName?: Path<T>;
  categories: CategoryEntity[];
  onChange?: (value?: string) => void;
} & ComponentBaseProps;

export default function FormFieldCardSelectCategory<T extends FieldValues>({
  form,
  formLabel,
  categories,
  fieldName = 'categoryId' as Path<T>,
  onChange,
}: FormFieldCardSelectCategoryProps<T>) {
  const t = useTranslations();
  const memoizedCategories = useMemo(() => renderCategories(categories), [categories]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{formLabel ?? t('form_field_category')}</CardTitle>
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
