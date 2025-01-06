import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { useTranslations } from 'use-intl';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '~react-web-ui-shadcn/components/ui/form';
import { Input } from '~react-web-ui-shadcn/components/ui/input';

type FormFieldInputPasswordProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  formLabel?: string;
  fieldName?: Path<T>;
  disabled?: boolean;
  minLength?: number;
  maxLength?: number;
};

export default function FormFieldInputPassword<T extends FieldValues>({
  form,
  formLabel,
  fieldName = 'password' as Path<T>,
  minLength = 8,
  maxLength = 255,
  disabled = false,
}: FormFieldInputPasswordProps<T>) {
  const t = useTranslations();

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field, fieldState: { error } }) => (
        <FormItem>
          <FormLabel>{formLabel ?? t('form_field_password')}</FormLabel>
          <FormControl>
            <Input {...field} disabled={disabled} />
          </FormControl>
          {error?.message && <FormMessage message={t(error.message, { min: minLength, max: maxLength })} />}
        </FormItem>
      )}
    />
  );
}
