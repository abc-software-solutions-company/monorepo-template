import { useTranslations } from 'next-intl';
import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@repo/react-web-ui-shadcn/components/ui/form';
import { Input } from '@repo/react-web-ui-shadcn/components/ui/input';

import { ComponentBaseProps } from '@/interfaces/component.interface';

type FormFieldInputEmailProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  formLabel?: string;
  fieldName?: Path<T>;
  minLength?: number;
  maxLength?: number;
} & ComponentBaseProps;

export default function FormFieldInputEmail<T extends FieldValues>({
  form,
  formLabel,
  fieldName = 'email' as Path<T>,
  minLength = 1,
  maxLength = 320,
}: FormFieldInputEmailProps<T>) {
  const t = useTranslations();

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field, fieldState: { error } }) => (
        <FormItem>
          <FormLabel>{formLabel ?? t('form_field_email')}</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          {error?.message && <FormMessage message={t(error.message, { min: minLength, max: maxLength })} />}
        </FormItem>
      )}
    />
  );
}
