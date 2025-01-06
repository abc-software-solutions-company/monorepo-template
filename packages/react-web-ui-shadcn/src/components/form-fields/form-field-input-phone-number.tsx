import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { useTranslations } from 'use-intl';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '~react-web-ui-shadcn/components/ui/form';
import { Input } from '~react-web-ui-shadcn/components/ui/input';

type FormFieldInputPhoneNumberProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  formLabel?: string;
  fieldName?: Path<T>;
};

export default function FormFieldInputPhoneNumber<T extends FieldValues>({
  form,
  formLabel,
  fieldName = 'phoneNumber' as Path<T>,
}: FormFieldInputPhoneNumberProps<T>) {
  const t = useTranslations();

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field, fieldState: { error } }) => (
        <FormItem>
          <FormLabel>{formLabel ?? t('form_field_phone_number')}</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          {error?.message && <FormMessage message={t(error.message)} />}
        </FormItem>
      )}
    />
  );
}
