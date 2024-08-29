import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { useTranslations } from 'use-intl';
import { Card, CardContent, CardHeader, CardTitle } from '~react-web-ui-shadcn/components/ui/card';
import { FormControl, FormField, FormItem, FormMessage } from '~react-web-ui-shadcn/components/ui/form';
import { Input } from '~react-web-ui-shadcn/components/ui/input';

import { ComponentBaseProps } from '@/interfaces/component.interface';

type FormFieldCardInputTypeProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  formLabel?: string;
  fieldName?: Path<T>;
  minLength?: number;
  maxLength?: number;
} & ComponentBaseProps;

export default function FormFieldCardInputType<T extends FieldValues>({
  form,
  formLabel,
  fieldName = 'type' as Path<T>,
  minLength = 1,
  maxLength = 50,
}: FormFieldCardInputTypeProps<T>) {
  const t = useTranslations();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{formLabel ?? t('form_field_type')}</CardTitle>
      </CardHeader>
      <CardContent>
        <FormField
          control={form.control}
          name={fieldName}
          render={({ field, fieldState: { error } }) => (
            <FormItem>
              <FormControl>
                <Input {...field} />
              </FormControl>
              {error?.message && <FormMessage message={t(error.message, { min: minLength, max: maxLength })} />}
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
