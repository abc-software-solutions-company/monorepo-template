import { useTranslations } from 'next-intl';
import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '~react-web-ui-shadcn/components/ui/form';
import { Input } from '~react-web-ui-shadcn/components/ui/input';

import { ComponentBaseProps } from '@/interfaces/component.interface';

type FormFieldInputUserNameProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  formLabel?: string;
  fieldName?: Path<T>;
  minLength?: number;
  maxLength?: number;
} & ComponentBaseProps;

export default function FormFieldInputUserName<T extends FieldValues>({
  form,
  formLabel,
  fieldName = 'name' as Path<T>,
  minLength = 1,
  maxLength = 50,
}: FormFieldInputUserNameProps<T>) {
  const t = useTranslations();

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field, fieldState: { error } }) => (
        <FormItem>
          <FormLabel>{formLabel ?? t('form_field_user_name')}</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          {error?.message && <FormMessage message={t(error.message, { min: minLength, max: maxLength })} />}
        </FormItem>
      )}
    />
  );
}
